import React, { useState } from 'react';
import { Alumnus, MemoryPhoto, MarginComment } from '../types';
import { CornerFiligree, PhotoCorners, VintageWashiTape, ArchivalStamp } from './Ornaments';
import { X, MapPin, Briefcase, MessageSquare, Feather } from 'lucide-react';
import { playQuillSound } from '../utils/audio';

interface MemoryModalProps {
    selectedAlumnus: Alumnus | null;
    selectedPhoto: MemoryPhoto | null;
    onClose: () => void;
    onAddMarginComment: (photoId: string, comment: Omit<MarginComment, 'id' | 'date'>) => Promise<void>;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
    selectedAlumnus,
    selectedPhoto,
    onClose,
    onAddMarginComment,
}) => {
    const [commentText, setCommentText] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [inkColor, setInkColor] = useState<MarginComment['inkColor']>('sepia');
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!selectedAlumnus && !selectedPhoto) return null;

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !selectedPhoto) return;

        setSubmitError(null);
        try {
            await onAddMarginComment(selectedPhoto.id, {
                author: authorName.trim() || 'Forza Youth Generation',
                text: commentText.trim(),
                inkColor,
                rotation: (Math.random() - 0.5) * 4,
            });
            playQuillSound();
            setCommentText('');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Coretan gagal disimpan.');
        }
    };

    const inkStyles = {
        sepia: 'text-[#6b3e18] border-[#a17045]/40',
        indigo: 'text-[#1c2e56] border-[#385189]/40',
        black: 'text-[#1e1713] border-[#4a392e]/40',
        burgundy: 'text-[#611320] border-[#913243]/40',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Antique Parchment Leaf Modal */}
            <div className="relative w-full max-w-4xl max-h-[94vh] parchment-texture rounded-lg border-2 border-[#b59972] shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
                {/* Ornate Corner Accents */}
                <CornerFiligree position="top-left" className="absolute top-2 left-2 w-10 sm:w-14 h-10 sm:h-14" gold={false} />
                <CornerFiligree position="top-right" className="absolute top-2 right-2 w-10 sm:w-14 h-10 sm:h-14" gold={false} />

                {/* Modal Top Brass Clasp Bar */}
                <div className="px-4 sm:px-6 py-2.5 sm:py-3.5 border-b border-[#cfbe9e] flex items-center justify-between bg-[#f4ebdb]/80 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-[#694827]">
                            {selectedAlumnus ? 'Lembaran Profil Alumni' : 'Lembaran Foto & Catatan Pinggir'}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 sm:p-1.5 rounded-full hover:bg-[#ebd9bd] text-[#5e4125] transition-colors cursor-pointer"
                        title="Tutup Lembaran"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content Scroll Area */}
                <div className="p-3.5 sm:p-6 md:p-8 book-scroll overflow-y-auto flex-1">
                    {selectedAlumnus && (
                        <div className="flex flex-col md:flex-row gap-5 sm:gap-8 items-start">
                            {/* Profile Photo with Vintage Mount */}
                            <div className="w-full md:w-56 lg:w-64 shrink-0 flex flex-col items-center">
                                <div className="relative w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 bg-[#e6d6be] border-2 border-[#94734d] p-1.5 sm:p-2 shadow-md">
                                    <PhotoCorners />
                                    <img
                                        src={selectedAlumnus.photoUrl}
                                        alt={selectedAlumnus.fullName}
                                        className="w-full h-full object-cover grayscale contrast-110 sepia-[0.25]"
                                    />
                                </div>
                                <div className="mt-2.5 sm:mt-3.5 text-center">
                                    <span className="font-source-serif text-xs sm:text-sm font-bold text-[#694827]">
                                        Stambuk: {selectedAlumnus.stambuk}
                                    </span>
                                    <div className="text-xs sm:text-sm font-cinzel text-[#825c35] font-semibold">
                                        Konsulat Priangan
                                    </div>
                                    {selectedAlumnus.prianganRegion && (
                                        <div className="text-xs font-source-serif italic text-[#966b3d]">
                                            {selectedAlumnus.prianganRegion}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Biography Details */}
                            <div className="flex-1 space-y-3.5 sm:space-y-5 min-w-0 w-full">
                                <div>
                                    <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-[#2a1708] leading-snug break-words">
                                        {selectedAlumnus.fullName}
                                    </h2>
                                    <div className="font-handwritten text-lg sm:text-2xl text-[#854d1d] font-bold mt-0.5 break-words">
                                        Laqob / Panggilan: &ldquo;{selectedAlumnus.kunya}&rdquo;
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm md:text-base font-source-serif text-[#4e3927] border-y border-[#d8c7a6] py-2.5 sm:py-3.5">
                                    <div className="flex items-center gap-1.5 break-words">
                                        <Briefcase className="w-3.5 h-3.5 text-[#854d1d] shrink-0" />
                                        <span><strong>Profesi:</strong> {selectedAlumnus.occupation}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 break-words">
                                        <MapPin className="w-3.5 h-3.5 text-[#854d1d] shrink-0" />
                                        <span><strong>Domisili:</strong> {selectedAlumnus.city}</span>
                                    </div>
                                    {(selectedAlumnus.rayonGontor || selectedAlumnus.dormitory) && (
                                        <div className="flex items-center gap-1.5 break-words">
                                            <span className="text-[#854d1d] font-bold">🏛️</span>
                                            <span><strong>Rayon Gontor:</strong> {selectedAlumnus.rayonGontor || selectedAlumnus.dormitory}</span>
                                        </div>
                                    )}
                                    {selectedAlumnus.email && (
                                        <div className="flex items-center gap-1.5 truncate">
                                            <span className="text-[#854d1d] font-bold">✉️</span>
                                            <span className="truncate"><strong>Email:</strong> {selectedAlumnus.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Kalam Kenangan */}
                                <div className="p-3 sm:p-4 rounded-lg border-l-4 border-[#854d1d] bg-[#f2e7d3]/80">
                                    <div className="font-cinzel text-[11px] sm:text-xs uppercase tracking-widest text-[#854d1d] font-bold mb-1">
                                        Kalam Kenangan Alumni
                                    </div>
                                    <p className="font-source-serif italic text-sm sm:text-base md:text-lg text-[#382312] leading-relaxed break-words">
                                        &ldquo;{selectedAlumnus.quote}&rdquo;
                                    </p>
                                </div>

                                {/* Bio / Story */}
                                {selectedAlumnus.bio && (
                                    <div>
                                        <h3 className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-[#694827] uppercase">
                                            Kilas Jejak di Pondok
                                        </h3>
                                        <p className="mt-1 text-sm sm:text-base font-source-serif leading-relaxed text-[#402b19] break-words">
                                            {selectedAlumnus.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Favorite Memory */}
                                {selectedAlumnus.favoriteMemory && (
                                    <div className="font-handwritten text-base sm:text-xl text-[#613813] bg-[#faf4e6] p-3 sm:p-4 rounded-lg border border-dashed border-[#cfbe9e] break-words">
                                        <strong>Kenangan Tak Terlupakan:</strong> &ldquo;{selectedAlumnus.favoriteMemory}&rdquo;
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedPhoto && (
                        <div className="flex flex-col md:flex-row gap-5 sm:gap-8 items-start">
                            {/* Enlarged Photo Container */}
                            <div className="w-full md:w-3/5 space-y-3">
                                <div className="relative p-2 sm:p-3 bg-[#fffefb] rounded border border-[#cfbe9e] shadow-md">
                                    <VintageWashiTape position="top" />
                                    <PhotoCorners />
                                    <div className="aspect-[4/3] max-h-[46vh] w-full overflow-hidden bg-[#e0d3bc] border border-[#9c7d58]">
                                        <img
                                            src={selectedPhoto.photoUrl}
                                            alt={selectedPhoto.title}
                                            className="w-full h-full object-contain bg-black/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                                        <h2 className="font-cinzel text-base sm:text-xl md:text-2xl font-bold text-[#2d1a0b] break-words">
                                            {selectedPhoto.title}
                                        </h2>
                                        <span className="font-source-serif text-xs sm:text-sm font-bold text-[#854d1d] shrink-0">
                                            Tahun {selectedPhoto.year}
                                        </span>
                                    </div>

                                    <p className="font-handwritten text-lg sm:text-2xl text-[#523720] mt-1 leading-relaxed break-words">
                                        &ldquo;{selectedPhoto.caption}&rdquo;
                                    </p>

                                    <div className="mt-2 text-xs sm:text-sm font-source-serif text-[#785b3e] flex flex-wrap gap-3 border-t border-[#d8c7a6] pt-2">
                                        <span><strong>Lokasi:</strong> {selectedPhoto.location}</span>
                                        <span><strong>Kategori:</strong> {selectedPhoto.category}</span>
                                        <span><strong>Diabadikan oleh:</strong> {selectedPhoto.uploaderName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Handwritten Margin Notes Section */}
                            <div className="w-full md:w-2/5 flex flex-col justify-between self-stretch bg-[#faf3e3]/80 p-3.5 sm:p-5 rounded-lg border border-[#cfbe9e]">
                                <div>
                                    <div className="flex items-center gap-1.5 font-cinzel text-xs sm:text-sm uppercase tracking-widest text-[#784e24] font-bold pb-2 border-b border-[#cfbe9e]">
                                        <MessageSquare className="w-3.5 h-3.5 text-[#8a5629]" />
                                        <span>Coretan Pinggir Sahabat ({selectedPhoto.marginNotes.length})</span>
                                    </div>

                                    <div className="space-y-2.5 my-2.5 max-h-56 book-scroll overflow-y-auto pr-1">
                                        {selectedPhoto.marginNotes.length === 0 ? (
                                            <div className="py-6 text-center font-handwritten text-base sm:text-lg text-[#7a5938] italic">
                                                Belum ada coretan pena pada foto ini. Jadilah yang pertama menuliskan kenangan!
                                            </div>
                                        ) : (
                                            selectedPhoto.marginNotes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    style={{ transform: `rotate(${note.rotation || 0}deg)` }}
                                                    className={`p-2.5 rounded-md border-b-2 border-dashed bg-[#fffefb]/90 ${inkStyles[note.inkColor || 'sepia']
                                                        }`}
                                                >
                                                    <p className="font-handwritten text-base sm:text-lg leading-relaxed break-words">
                                                        &ldquo;{note.text}&rdquo;
                                                    </p>
                                                    <div className="mt-1 flex items-baseline justify-between text-xs">
                                                        <span className="font-cinzel font-bold text-xs text-[#3a2512] break-words">
                                                            — {note.author} {note.authorKunya ? `(${note.authorKunya})` : ''}
                                                        </span>
                                                        <span className="font-source-serif text-[10px] opacity-75">{note.date}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Add Margin Note Form */}
                                <form onSubmit={handleCommentSubmit} className="pt-2.5 border-t border-[#cfbe9e] space-y-2">
                                    <p className="font-source-serif text-[10px] italic text-[#785b3e]">
                                        Nama hanya atribusi tampilan; akun bersama tidak memverifikasi identitas penulis.
                                    </p>
                                    <div className="flex gap-1.5">
                                        <input
                                            type="text"
                                            placeholder="Nama tampilan (opsional)"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            className="w-1/2 px-2.5 py-1 text-xs sm:text-sm font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded-md text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                                        />
                                        <select
                                            value={inkColor}
                                            onChange={(e) => setInkColor(e.target.value as MarginComment['inkColor'])}
                                            className="w-1/2 px-2 py-1 text-[11px] sm:text-xs font-cinzel bg-[#f3ebd8] border border-[#bfa683] rounded-md text-[#3d2919] focus:outline-none focus:border-[#7d512a] font-semibold"
                                        >
                                            <option value="sepia">Tinta Cokelat</option>
                                            <option value="indigo">Tinta Biru</option>
                                            <option value="black">Tinta Hitam</option>
                                            <option value="burgundy">Tinta Merah</option>
                                        </select>
                                    </div>

                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Tuliskan coretan tanganmu pada foto ini..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="w-full px-2.5 py-1 text-xs sm:text-sm font-handwritten bg-[#f3ebd8] border border-[#bfa683] rounded-md text-[#3d2919] focus:outline-none focus:border-[#7d512a] resize-none"
                                    />

                                    <button
                                        type="submit"
                                        className="w-full py-1.5 bg-[#422610] hover:bg-[#5e3819] text-[#fbf5e8] rounded-md font-cinzel text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Feather className="w-3.5 h-3.5 text-[#e5b565]" />
                                        <span>Goreskan Catatan</span>
                                    </button>
                                    {submitError && <p role="alert" className="font-source-serif text-xs text-red-900">{submitError}</p>}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
