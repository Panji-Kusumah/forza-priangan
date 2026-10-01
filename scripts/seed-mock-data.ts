import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ALUMNI, INITIAL_MEMORY_PHOTOS, INITIAL_SIGNATURES } from '../src/data/mockData';

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function seedMockData() {
    const { data: existingAlumni, error: alumniQueryError } = await supabase
        .from('alumni')
        .select('id, full_name, details');

    if (alumniQueryError) throw alumniQueryError;
    const alumniIds = new Map<string, string>();
    for (const alumnus of existingAlumni ?? []) {
        const sourceMockId = (alumnus.details as Record<string, unknown> | null)?.sourceMockId;
        if (typeof sourceMockId === 'string') alumniIds.set(sourceMockId, alumnus.id);
    }
    const missingAlumni = INITIAL_ALUMNI.filter((alumnus) => !alumniIds.has(alumnus.id));

    if (missingAlumni.length) {
        const { data: alumniRows, error: alumniError } = await supabase
            .from('alumni')
            .insert(missingAlumni.map((alumnus) => ({
                full_name: alumnus.fullName,
                regional_origin: alumnus.prianganRegion,
                profession: alumnus.occupation,
                profile_photo_url: alumnus.photoUrl,
                details: {
                    kunya: alumnus.kunya,
                    consulat: alumnus.consulat,
                    stambuk: alumnus.stambuk,
                    city: alumnus.city,
                    quote: alumnus.quote,
                    bio: alumnus.bio,
                    favoriteMemory: alumnus.favoriteMemory,
                    dormitory: alumnus.dormitory,
                    rayonGontor: alumnus.rayonGontor,
                    sourceMockId: alumnus.id,
                },
            })))
            .select('id, full_name, details');

        if (alumniError || !alumniRows) throw alumniError ?? new Error('Alumni seed returned no records.');
        for (const alumnus of alumniRows) {
            const sourceMockId = (alumnus.details as Record<string, unknown> | null)?.sourceMockId;
            if (typeof sourceMockId === 'string') alumniIds.set(sourceMockId, alumnus.id);
        }
    }

    const firstAlumniId = alumniIds.values().next().value as string | undefined;
    if (!firstAlumniId) throw new Error('No alumni records were created.');

    const { data: existingMemories, error: memoriesQueryError } = await supabase
        .from('memories')
        .select('id, details');
    if (memoriesQueryError) throw memoriesQueryError;
    const seededMemoryIds = new Set((existingMemories ?? []).map((memory) => {
        const sourceMockId = (memory.details as Record<string, unknown> | null)?.sourceMockId;
        return typeof sourceMockId === 'string' ? sourceMockId : '';
    }));
    const missingPhotos = INITIAL_MEMORY_PHOTOS.filter((photo) => !seededMemoryIds.has(photo.id));

    if (missingPhotos.length) {
        const { error: memoriesError } = await supabase.from('memories').insert(
            missingPhotos.map((photo) => ({
                alumni_id: alumniIds.get(INITIAL_ALUMNI.find((alumnus) => alumnus.fullName === photo.uploaderName)?.id ?? '') ?? firstAlumniId,
                image_url: photo.photoUrl,
                caption: photo.caption,
                details: {
                    sourceMockId: photo.id,
                    title: photo.title,
                    year: photo.year,
                    location: photo.location,
                    category: photo.category,
                    uploaderName: photo.uploaderName,
                    uploaderKunya: photo.uploaderKunya,
                    tilt: photo.tilt,
                    mounting: photo.mounting,
                    marginNotes: photo.marginNotes,
                },
            }))
        );

        if (memoriesError) throw memoriesError;
    }

    const { data: memoryRows, error: memoryRowsError } = await supabase
        .from('memories')
        .select('id, details');
    if (memoryRowsError) throw memoryRowsError;
    const memoryIdsByMockId = new Map<string, string>();
    for (const memory of memoryRows ?? []) {
        const sourceMockId = (memory.details as Record<string, unknown> | null)?.sourceMockId;
        if (typeof sourceMockId === 'string') memoryIdsByMockId.set(sourceMockId, memory.id);
    }

    const { data: existingNotes, error: notesQueryError } = await supabase
        .from('memory_notes')
        .select('client_id');
    if (notesQueryError) throw notesQueryError;
    const noteIds = new Set((existingNotes ?? []).map((note) => note.client_id));
    const missingNotes = INITIAL_MEMORY_PHOTOS.flatMap((photo) =>
        photo.marginNotes
            .filter((note) => !noteIds.has(note.id) && memoryIdsByMockId.has(photo.id))
            .map((note) => ({
                client_id: note.id,
                memory_id: memoryIdsByMockId.get(photo.id)!,
                author: note.author,
                author_kunya: note.authorKunya ?? null,
                content: note.text,
                date_label: note.date,
                ink_color: note.inkColor ?? 'sepia',
                rotation: note.rotation ?? 0,
            }))
    );
    if (missingNotes.length) {
        const { error } = await supabase.from('memory_notes').upsert(missingNotes, {
            onConflict: 'client_id',
            ignoreDuplicates: true,
        });
        if (error) throw error;
    }

    const { data: existingSignatures, error: signaturesQueryError } = await supabase
        .from('signatures')
        .select('client_id');
    if (signaturesQueryError) throw signaturesQueryError;
    const signatureIds = new Set((existingSignatures ?? []).map((signature) => signature.client_id));
    const missingSignatures = INITIAL_SIGNATURES
        .filter((signature) => !signatureIds.has(signature.id))
        .map((signature) => ({
            client_id: signature.id,
            source_mock_id: signature.id,
            name: signature.name,
            kunya: signature.kunya,
            consulat: signature.consulat,
            message: signature.message,
            date_label: signature.date,
            ink_color: signature.inkColor,
            hand_style: signature.handStyle,
            rotation: signature.rotation,
        }));
    if (missingSignatures.length) {
        const { error } = await supabase.from('signatures').upsert(missingSignatures, {
            onConflict: 'client_id',
            ignoreDuplicates: true,
        });
        if (error) throw error;
    }

    console.info(
        `Seeded missing mock data: ${missingAlumni.length} alumni, ${missingPhotos.length} photos, ${missingNotes.length} notes, and ${missingSignatures.length} signatures.`
    );
}

seedMockData().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});