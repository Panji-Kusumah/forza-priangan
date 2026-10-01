/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClosedBook } from './components/ClosedBook';
import { OpenBook } from './components/OpenBook';
import { MemoryModal } from './components/MemoryModal';
import { Alumnus, MemoryPhoto, SignatureEntry, MarginComment } from './types';
import {
    INITIAL_ALUMNI,
    INITIAL_MEMORY_PHOTOS,
    INITIAL_SIGNATURES,
} from './data/mockData';
import { playBookOpenSound } from './utils/audio';
import { getSupabaseBrowserClient } from './lib/supabase';

type AlumniRecord = {
    id: string;
    full_name: string;
    regional_origin: string;
    profession: string;
    profile_photo_url: string | null;
    details: Record<string, unknown>;
};

const PUBLIC_ALUMNI_COLUMNS = 'id, full_name, regional_origin, profession, profile_photo_url, details, created_at, updated_at';

const resolvePhotoUrl = (url?: string | null): string =>
    !url || url.includes('images.unsplash.com') ? '/logokonsul.png' : url;

type MemoryRecord = {
    id: string;
    alumni_id: string;
    image_url: string;
    caption: string;
    details: Record<string, unknown>;
};

type SignatureRecord = {
    id: string;
    client_id: string;
    name: string;
    kunya: string;
    consulat: string;
    message: string;
    date_label: string;
    ink_color: SignatureEntry['inkColor'];
    hand_style: SignatureEntry['handStyle'];
    rotation: number;
};

type MemoryNoteRecord = {
    id: string;
    client_id: string;
    memory_id: string;
    author: string;
    author_kunya: string | null;
    content: string;
    date_label: string;
    ink_color: MarginComment['inkColor'];
    rotation: number;
};

const toAlumnus = (record: AlumniRecord): Alumnus => {
    const details = record.details ?? {};
    return {
        id: record.id,
        fullName: record.full_name,
        kunya: String(details.kunya ?? 'Sahabat 2008'),
        consulat: String(details.consulat ?? 'Konsulat Priangan'),
        prianganRegion: normalizePrianganRegion(record.regional_origin),
        stambuk: String(details.stambuk ?? '08'),
        city: String(details.city ?? record.regional_origin),
        occupation: record.profession,
        quote: String(details.quote ?? ''),
        bio: String(details.bio ?? ''),
        photoUrl: resolvePhotoUrl(record.profile_photo_url),
        favoriteMemory: String(details.favoriteMemory ?? ''),
        contact: typeof details.contact === 'string' ? details.contact : undefined,
        dormitory: typeof details.dormitory === 'string' ? details.dormitory : undefined,
        rayonGontor: typeof details.rayonGontor === 'string' ? details.rayonGontor : undefined,
        email: typeof details.email === 'string' ? details.email : undefined,
    };
};

const toMemoryPhoto = (record: MemoryRecord): MemoryPhoto => {
    const details = record.details ?? {};
    return {
        id: record.id,
        title: String(details.title ?? 'Kenangan Alumni'),
        caption: record.caption,
        year: String(details.year ?? new Date().getFullYear()),
        location: String(details.location ?? 'Konsulat Priangan'),
        category: (details.category as MemoryPhoto['category']) ?? 'Konsulat Priangan',
        photoUrl: resolvePhotoUrl(record.image_url),
        uploaderName: String(details.uploaderName ?? 'Sahabat 2008'),
        uploaderKunya: typeof details.uploaderKunya === 'string' ? details.uploaderKunya : undefined,
        tilt: Number(details.tilt ?? 0),
        mounting: (details.mounting as MemoryPhoto['mounting']) ?? 'corners',
        marginNotes: [],
    };
};

const toSignature = (record: SignatureRecord): SignatureEntry => ({
    id: record.id,
    name: record.name,
    kunya: record.kunya,
    consulat: record.consulat,
    message: record.message,
    date: record.date_label,
    inkColor: record.ink_color,
    handStyle: record.hand_style,
    rotation: record.rotation,
});

const toMarginComment = (record: MemoryNoteRecord): MarginComment => ({
    id: record.id,
    author: record.author,
    authorKunya: record.author_kunya ?? undefined,
    text: record.content,
    date: record.date_label,
    inkColor: record.ink_color,
    rotation: record.rotation,
});

const getImageExtension = (file: File): string => {
    const extensions: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/avif': 'avif',
    };
    if (!extensions[file.type] || file.size > 10 * 1024 * 1024) {
        throw new Error('Gunakan foto JPEG, PNG, WebP, atau AVIF berukuran maksimal 10 MB.');
    }
    return extensions[file.type];
};

const STORAGE_KEYS = {
    ALUMNI: 'gontor_2008_alumni_v5',
    PHOTOS: 'gontor_2008_photos_v5',
    SIGNATURES: 'gontor_2008_signatures_v5',
    MARGIN_NOTES: 'gontor_2008_margin_notes_v1',
};

// Ensure all regions strictly conform to: Bandung Raya, Sumedang, Garut, Tasik, Ciamis
const normalizePrianganRegion = (r?: string): string => {
    if (!r) return 'Bandung Raya';
    const lower = r.toLowerCase();
    if (lower.includes('tasik')) return 'Tasik';
    if (lower.includes('ciamis') || lower.includes('banjar') || lower.includes('pangandaran')) return 'Ciamis';
    if (lower.includes('garut')) return 'Garut';
    if (lower.includes('sumedang')) return 'Sumedang';
    return 'Bandung Raya';
};

export default function App() {
    const supabase = getSupabaseBrowserClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [closedCoverSide, setClosedCoverSide] = useState<'front' | 'back'>('front');
    const openTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
        };
    }, []);

    // Hydrate browser-only data after mount to keep the server render deterministic.
    const [alumniList, setAlumniList] = useState<Alumnus[]>(() => {
        return [...INITIAL_ALUMNI].sort((a, b) =>
            a.fullName.trim().localeCompare(b.fullName.trim(), 'id', { sensitivity: 'base' })
        );
    });
    const [photos, setPhotos] = useState<MemoryPhoto[]>(INITIAL_MEMORY_PHOTOS);
    const [signatures, setSignatures] = useState<SignatureEntry[]>(INITIAL_SIGNATURES);
    const [storageReady, setStorageReady] = useState(false);
    const [authEmail, setAuthEmail] = useState<string | null>(null);
    const [authUserId, setAuthUserId] = useState<string | null>(null);
    const [isSharedEditor, setIsSharedEditor] = useState(false);

    useEffect(() => {
        let active = true;
        const archiveKeys = Object.values(STORAGE_KEYS);
        const legacyArchive = Object.fromEntries(
            archiveKeys.map((key) => [key, localStorage.getItem(key)])
        );
        if (archiveKeys.some((key) => legacyArchive[key])) {
            try {
                if (!localStorage.getItem('gontor_2008_legacy_backup_v1')) {
                    localStorage.setItem('gontor_2008_legacy_backup_v1', JSON.stringify(legacyArchive));
                }
            } catch { }
        }

        try {
            const savedSignatures = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
            if (savedSignatures) {
                const parsed: SignatureEntry[] = JSON.parse(savedSignatures);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSignatures(parsed.map((sig) => ({
                        ...sig,
                        consulat: normalizePrianganRegion(sig.consulat),
                    })));
                }
            }
        } catch { }

        const loadData = async () => {
            if (!supabase) {
                try {
                    const savedAlumni = localStorage.getItem(STORAGE_KEYS.ALUMNI);
                    if (savedAlumni) {
                        const parsed: Alumnus[] = JSON.parse(savedAlumni);
                        if (Array.isArray(parsed) && parsed.length) {
                            setAlumniList(parsed.map((alumnus) => ({
                                ...alumnus,
                                photoUrl: resolvePhotoUrl(alumnus.photoUrl),
                            })));
                        }
                    }
                    const savedPhotos = localStorage.getItem(STORAGE_KEYS.PHOTOS);
                    if (savedPhotos) {
                        const parsed: MemoryPhoto[] = JSON.parse(savedPhotos);
                        if (Array.isArray(parsed) && parsed.length) {
                            setPhotos(parsed.map((photo) => ({
                                ...photo,
                                photoUrl: resolvePhotoUrl(photo.photoUrl),
                            })));
                        }
                    }
                } catch { }
                if (active) setStorageReady(true);
                return;
            }

            const [alumniResult, memoriesResult, signaturesResult, notesResult, sessionResult] = await Promise.all([
                supabase.from('alumni').select(PUBLIC_ALUMNI_COLUMNS).order('full_name'),
                supabase.from('memories').select('*').order('created_at', { ascending: false }),
                supabase.from('signatures').select('*').order('created_at', { ascending: false }),
                supabase.from('memory_notes').select('*').order('created_at', { ascending: false }),
                supabase.auth.getSession(),
            ]);
            if (!active) return;

            setAuthEmail(sessionResult.data.session?.user.email ?? null);
            setAuthUserId(sessionResult.data.session?.user.id ?? null);
            if (alumniResult.error || memoriesResult.error) {
                console.error('Supabase data load failed', alumniResult.error ?? memoriesResult.error);
            } else {
                const loadedAlumni = (alumniResult.data ?? []).map((row) => toAlumnus(row as AlumniRecord));
                let savedMarginNotes: Record<string, MarginComment[]> = {};
                try {
                    savedMarginNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.MARGIN_NOTES) ?? '{}');
                } catch { }
                const notesByMemoryId = new Map<string, MarginComment[]>();
                for (const row of notesResult.data ?? []) {
                    const note = toMarginComment(row as MemoryNoteRecord);
                    const notes = notesByMemoryId.get(row.memory_id) ?? [];
                    notes.push(note);
                    notesByMemoryId.set(row.memory_id, notes);
                }
                const loadedPhotos = (memoriesResult.data ?? []).map((row) => {
                    const photo = toMemoryPhoto(row as MemoryRecord);
                    return {
                        ...photo,
                        marginNotes: [...(notesByMemoryId.get(photo.id) ?? []), ...(savedMarginNotes[photo.id] ?? [])],
                    };
                });
                if (loadedAlumni.length) setAlumniList(loadedAlumni);
                if (loadedPhotos.length) setPhotos(loadedPhotos);
            }
            if (signaturesResult.error) {
                console.error('Supabase signatures load failed', signaturesResult.error);
            } else {
                setSignatures((signaturesResult.data ?? []).map((row) => toSignature(row as SignatureRecord)));
            }
            if (notesResult.error) console.error('Supabase memory notes load failed', notesResult.error);
            setStorageReady(true);
        };

        const authListener = supabase?.auth.onAuthStateChange((_event, session) => {
            if (active) {
                setAuthEmail(session?.user.email ?? null);
                setAuthUserId(session?.user.id ?? null);
            }
        });
        void loadData();

        return () => {
            active = false;
            authListener?.data.subscription.unsubscribe();
        };
    }, [supabase]);

    useEffect(() => {
        if (!supabase || !authUserId) {
            setIsSharedEditor(false);
            return;
        }
        let active = true;
        void supabase.rpc('is_shared_editor').then(({ data, error }) => {
            if (!active) return;
            if (error) {
                console.error('Unable to verify shared-account access', error);
                setIsSharedEditor(false);
                return;
            }
            setIsSharedEditor(data === true);
        });
        return () => {
            active = false;
        };
    }, [supabase, authUserId]);

    useEffect(() => {
        if (!supabase || !isSharedEditor) return;
        const migrationKey = 'gontor_2008_local_entries_migrated_v1';
        if (localStorage.getItem(migrationKey)) return;
        let active = true;

        const migrateLocalEntries = async () => {
            const localSignatures = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIGNATURES) ?? '[]') as SignatureEntry[];
            if (localSignatures.length) {
                const { error } = await supabase.from('signatures').upsert(
                    localSignatures.map((signature) => ({
                        client_id: signature.id,
                        name: signature.name,
                        kunya: signature.kunya,
                        consulat: signature.consulat,
                        message: signature.message,
                        date_label: signature.date,
                        ink_color: signature.inkColor,
                        hand_style: signature.handStyle,
                        rotation: signature.rotation,
                    })),
                    { onConflict: 'client_id', ignoreDuplicates: true }
                );
                if (error) throw error;
            }

            const [memoryRowsResult, localPhotosRaw, localNotesRaw] = await Promise.all([
                supabase.from('memories').select('id, details'),
                Promise.resolve(localStorage.getItem(STORAGE_KEYS.PHOTOS)),
                Promise.resolve(localStorage.getItem(STORAGE_KEYS.MARGIN_NOTES)),
            ]);
            if (memoryRowsResult.error) throw memoryRowsResult.error;

            const memoryIdsByLegacyId = new Map<string, string>();
            for (const memory of memoryRowsResult.data ?? []) {
                memoryIdsByLegacyId.set(memory.id, memory.id);
                const sourceMockId = (memory.details as Record<string, unknown> | null)?.sourceMockId;
                if (typeof sourceMockId === 'string') memoryIdsByLegacyId.set(sourceMockId, memory.id);
            }

            const localPhotos = localPhotosRaw ? JSON.parse(localPhotosRaw) as MemoryPhoto[] : [];
            const sidecarNotes = localNotesRaw
                ? JSON.parse(localNotesRaw) as Record<string, MarginComment[]>
                : {};
            const noteRows = new Map<string, {
                client_id: string;
                memory_id: string;
                author: string;
                author_kunya: string | null;
                content: string;
                date_label: string;
                ink_color: NonNullable<MarginComment['inkColor']>;
                rotation: number;
            }>();

            for (const photo of localPhotos) {
                const memoryId = memoryIdsByLegacyId.get(photo.id);
                if (!memoryId) continue;
                for (const note of [...photo.marginNotes, ...(sidecarNotes[photo.id] ?? [])]) {
                    noteRows.set(note.id, {
                        client_id: note.id,
                        memory_id: memoryId,
                        author: note.author,
                        author_kunya: note.authorKunya ?? null,
                        content: note.text,
                        date_label: note.date,
                        ink_color: note.inkColor ?? 'sepia',
                        rotation: note.rotation ?? 0,
                    });
                }
            }

            for (const [legacyPhotoId, notes] of Object.entries(sidecarNotes)) {
                const memoryId = memoryIdsByLegacyId.get(legacyPhotoId);
                if (!memoryId) continue;
                for (const note of notes) {
                    noteRows.set(note.id, {
                        client_id: note.id,
                        memory_id: memoryId,
                        author: note.author,
                        author_kunya: note.authorKunya ?? null,
                        content: note.text,
                        date_label: note.date,
                        ink_color: note.inkColor ?? 'sepia',
                        rotation: note.rotation ?? 0,
                    });
                }
            }

            if (noteRows.size) {
                const { error } = await supabase.from('memory_notes').upsert([...noteRows.values()], {
                    onConflict: 'client_id',
                    ignoreDuplicates: true,
                });
                if (error) throw error;
            }

            const [signaturesResult, notesResult] = await Promise.all([
                supabase.from('signatures').select('*').order('created_at', { ascending: false }),
                supabase.from('memory_notes').select('*').order('created_at', { ascending: false }),
            ]);
            if (signaturesResult.error) throw signaturesResult.error;
            if (notesResult.error) throw notesResult.error;
            if (!active) return;

            setSignatures((signaturesResult.data ?? []).map((row) => toSignature(row as SignatureRecord)));
            const notesByMemoryId = new Map<string, MarginComment[]>();
            for (const row of notesResult.data ?? []) {
                const note = toMarginComment(row as MemoryNoteRecord);
                const notes = notesByMemoryId.get(row.memory_id) ?? [];
                notes.push(note);
                notesByMemoryId.set(row.memory_id, notes);
            }
            setPhotos((previous) => previous.map((photo) => ({
                ...photo,
                marginNotes: notesByMemoryId.get(photo.id) ?? [],
            })));
            localStorage.setItem(migrationKey, new Date().toISOString());
        };

        void migrateLocalEntries().catch((error: unknown) => {
            console.error('Unable to migrate local signatures and notes', error);
        });
        return () => {
            active = false;
        };
    }, [supabase, isSharedEditor]);

    // Modal inspection states
    const [selectedAlumnus, setSelectedAlumnus] = useState<Alumnus | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);

    useEffect(() => {
        if (!storageReady || supabase) return;
        try {
            localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signatures));
        } catch { }
    }, [signatures, storageReady]);

    // Open book handler with physical audio and easing
    const handleOpenBook = useCallback(() => {
        if (isOpen || isOpening) return;
        if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
        setIsOpening(true);
        playBookOpenSound();

        openTimerRef.current = window.setTimeout(() => {
            setIsOpen(true);
            setIsOpening(false);
        }, 900);
    }, [isOpen, isOpening]);

    const handleCloseBook = useCallback((targetSide: 'front' | 'back' = 'front') => {
        setClosedCoverSide(targetSide);
        setIsOpen(false);
    }, []);

    const handleAddAlumnus = useCallback(async (newAlumnus: Alumnus, file?: File, editingId?: string) => {
        if (!supabase) throw new Error('Supabase belum dikonfigurasi. Arsip lama tetap tersimpan di perangkat ini.');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user || !isSharedEditor) throw new Error('Masuk dengan akun bersama untuk menyimpan profil.');
        if (!user.email_confirmed_at) throw new Error('Verifikasi alamat email sebelum menyimpan profil.');

        const { data: current, error: profileError } = editingId
            ? await supabase.from('alumni').select(PUBLIC_ALUMNI_COLUMNS).eq('id', editingId).maybeSingle()
            : { data: null, error: null };
        if (profileError) throw profileError;
        if (editingId && !current) throw new Error('Profil alumni yang dipilih tidak ditemukan.');

        let profilePhotoUrl = resolvePhotoUrl(current?.profile_photo_url ?? newAlumnus.photoUrl);
        if (file) {
            const extension = getImageExtension(file);
            const path = `${user.id}/profiles/${crypto.randomUUID()}.${extension}`;
            const { error: uploadError } = await supabase.storage.from('memory-images').upload(path, file, {
                contentType: file.type,
                upsert: false,
            });
            if (uploadError) throw uploadError;
            profilePhotoUrl = supabase.storage.from('memory-images').getPublicUrl(path).data.publicUrl;
        }

        const payload = {
            full_name: newAlumnus.fullName,
            regional_origin: newAlumnus.prianganRegion,
            profession: newAlumnus.occupation,
            profile_photo_url: profilePhotoUrl,
            details: {
                kunya: newAlumnus.kunya,
                consulat: newAlumnus.consulat,
                stambuk: newAlumnus.stambuk,
                city: newAlumnus.city,
                quote: newAlumnus.quote,
                bio: newAlumnus.bio,
                favoriteMemory: newAlumnus.favoriteMemory,
                rayonGontor: newAlumnus.rayonGontor,
            },
        };
        const result = editingId
            ? await supabase.from('alumni').update(payload).eq('id', editingId).select(PUBLIC_ALUMNI_COLUMNS).single()
            : await supabase.from('alumni').insert(payload).select(PUBLIC_ALUMNI_COLUMNS).single();
        if (result.error) throw result.error;

        const savedAlumnus = toAlumnus(result.data as AlumniRecord);
        setAlumniList((previous) => [...previous.filter((item) => item.id !== savedAlumnus.id), savedAlumnus]
            .sort((a, b) => a.fullName.localeCompare(b.fullName, 'id', { sensitivity: 'base' })));
    }, [supabase, isSharedEditor]);

    const handleAddMemoryPhoto = useCallback(async (newPhoto: MemoryPhoto, file?: File) => {
        if (!supabase) throw new Error('Supabase belum dikonfigurasi. Arsip lama tetap tersimpan di perangkat ini.');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user || !isSharedEditor) throw new Error('Masuk dengan akun bersama sebelum mengunggah foto.');
        if (!user.email_confirmed_at) throw new Error('Verifikasi alamat email sebelum mengunggah foto.');
        if (!file) throw new Error('Pilih berkas foto dari perangkat.');

        const extension = getImageExtension(file);
        const path = `${user.id}/memories/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('memory-images').upload(path, file, {
            contentType: file.type,
            upsert: false,
        });
        if (uploadError) throw uploadError;

        const imageUrl = supabase.storage.from('memory-images').getPublicUrl(path).data.publicUrl;
        const { data, error } = await supabase.from('memories').insert({
            alumni_id: null,
            image_url: imageUrl,
            caption: newPhoto.caption,
            details: {
                title: newPhoto.title,
                year: newPhoto.year,
                location: newPhoto.location,
                category: newPhoto.category,
                uploaderName: 'Forza Youth Generation',
                uploaderKunya: 'Konsulat Priangan',
                tilt: newPhoto.tilt,
                mounting: newPhoto.mounting,
                marginNotes: [],
            },
        }).select('*').single();
        if (error) throw error;

        setPhotos((previous) => [toMemoryPhoto(data as MemoryRecord), ...previous]);
    }, [supabase, isSharedEditor]);

    const handleSignIn = useCallback(async (username: string, password: string) => {
        if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
        const sharedUsername = process.env.NEXT_PUBLIC_SHARED_ACCOUNT_USERNAME?.trim();
        const sharedEmail = process.env.NEXT_PUBLIC_SHARED_ACCOUNT_EMAIL?.trim();
        if (!sharedUsername || !sharedEmail) throw new Error('Konfigurasikan ID dan email akun bersama di `.env.local`.');
        if (username.trim().toLowerCase() !== sharedUsername.toLowerCase()) {
            throw new Error('ID akun bersama tidak cocok.');
        }
        const { error } = await supabase.auth.signInWithPassword({ email: sharedEmail, password });
        if (error) throw error;
    }, [supabase]);

    const handleSignOut = useCallback(async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, [supabase]);

    const handleExportLegacy = useCallback(() => {
        const keys = [...Object.values(STORAGE_KEYS), 'gontor_2008_legacy_backup_v1'];
        const archive = Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)]));
        const url = URL.createObjectURL(new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'marhalah-2008-local-archive.json';
        link.click();
        URL.revokeObjectURL(url);
    }, []);

    const handleAddSignature = useCallback(async (entry: Omit<SignatureEntry, 'id' | 'date'>) => {
        const date = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date());

        if (supabase) {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user || !isSharedEditor) throw new Error('Masuk dengan akun bersama untuk menambahkan autograph.');
            const { data, error } = await supabase.from('signatures').insert({
                client_id: crypto.randomUUID(),
                ...entry,
                date_label: date,
                ink_color: entry.inkColor,
                hand_style: entry.handStyle,
            }).select('*').single();
            if (error) throw error;
            setSignatures((previous) => [toSignature(data as SignatureRecord), ...previous]);
            return;
        }

        setSignatures((previous) => [{ ...entry, id: `sig-${Date.now()}`, date }, ...previous]);
    }, [supabase, isSharedEditor]);

    const handleAddMarginComment = useCallback(async (
        photoId: string,
        comment: Omit<MarginComment, 'id' | 'date'>
    ) => {
        const date = new Intl.DateTimeFormat('id-ID', {
            month: 'short',
            year: 'numeric',
        }).format(new Date());
        let newComment: MarginComment;

        if (supabase) {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user || !isSharedEditor) throw new Error('Masuk dengan akun bersama untuk menambahkan coretan.');
            const { data, error } = await supabase.from('memory_notes').insert({
                client_id: crypto.randomUUID(),
                memory_id: photoId,
                author: comment.author,
                author_kunya: comment.authorKunya,
                content: comment.text,
                date_label: date,
                ink_color: comment.inkColor ?? 'sepia',
                rotation: comment.rotation ?? 0,
            }).select('*').single();
            if (error) throw error;
            newComment = toMarginComment(data as MemoryNoteRecord);
        } else {
            newComment = { ...comment, id: `c-${Date.now()}`, date };
        }

        setPhotos((prev) =>
            prev.map((p) => {
                if (p.id === photoId) {
                    const updated = {
                        ...p,
                        marginNotes: [newComment, ...p.marginNotes],
                    };
                    setSelectedPhoto((curr) => (curr && curr.id === photoId ? updated : curr));
                    return updated;
                }
                return p;
            })
        );
    }, [supabase, isSharedEditor]);

    const handleSelectAlumnus = useCallback((alm: Alumnus) => {
        setSelectedAlumnus(alm);
    }, []);

    const handleSelectPhoto = useCallback((photo: MemoryPhoto) => {
        setSelectedPhoto(photo);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedAlumnus(null);
        setSelectedPhoto(null);
    }, []);

    return (
        <main className="w-full min-h-screen bg-[#0e0704] text-[#2c1d11] overflow-x-hidden">
            {!isOpen ? (
                <ClosedBook
                    onOpen={handleOpenBook}
                    isOpening={isOpening}
                    initialCoverSide={closedCoverSide}
                />
            ) : (
                <OpenBook
                    onCloseBook={handleCloseBook}
                    alumniList={alumniList}
                    photos={photos}
                    signatures={signatures}
                    onSelectAlumnus={handleSelectAlumnus}
                    onSelectPhoto={handleSelectPhoto}
                    onAddSignature={handleAddSignature}
                    onAddAlumnus={handleAddAlumnus}
                    onAddMemoryPhoto={handleAddMemoryPhoto}
                    authEmail={authEmail}
                    isSharedEditor={isSharedEditor}
                    supabaseConfigured={Boolean(
                        supabase &&
                        process.env.NEXT_PUBLIC_SHARED_ACCOUNT_USERNAME &&
                        process.env.NEXT_PUBLIC_SHARED_ACCOUNT_EMAIL
                    )}
                    onSignIn={handleSignIn}
                    onSignOut={handleSignOut}
                    onExportLegacy={handleExportLegacy}
                />
            )}

            {/* Illuminated Detail View Modal */}
            {(selectedAlumnus || selectedPhoto) && (
                <MemoryModal
                    selectedAlumnus={selectedAlumnus}
                    selectedPhoto={selectedPhoto}
                    onClose={handleCloseModal}
                    onAddMarginComment={handleAddMarginComment}
                />
            )}
        </main>
    );
}
