import React, { useState, memo } from 'react';
import { ArchivalStamp, PhotoCorners, VintageWashiTape } from '../Ornaments';
import { MemoryPhoto } from '../../types';
import { Plus, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface Spread3PhotosProps {
    photos: MemoryPhoto[];
    onSelectPhoto: (photo: MemoryPhoto) => void;
    onOpenContribute: () => void;
    mobilePageSide?: 'left' | 'right';
}

export const Spread3Photos = memo<Spread3PhotosProps>(({
    photos,
    onSelectPhoto,
    onOpenContribute,
    mobilePageSide = 'left',
}) => {
    const [photoPageIndex, setPhotoPageIndex] = useState(0);

    // 2 photos per spread (1 left, 1 right) on both mobile and desktop
    const itemsPerPage = 2;
    const totalPhotoPages = Math.max(1, Math.ceil(photos.length / itemsPerPage));
    const safePageIndex = Math.min(photoPageIndex, totalPhotoPages - 1);

    const currentBatch = photos.slice(
        safePageIndex * itemsPerPage,
        safePageIndex * itemsPerPage + itemsPerPage
    );

    const leftPhoto = currentBatch[0];
    const rightPhoto = currentBatch[1];

    const handleNextLeaf = () => {
        if (safePageIndex < totalPhotoPages - 1) {
            setPhotoPageIndex(safePageIndex + 1);
        }
    };

    const handlePrevLeaf = () => {
        if (safePageIndex > 0) {
            setPhotoPageIndex(safePageIndex - 1);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none">
            {/* Antique Header Control */}
            <div className="px-2 sm:px-4 md:px-6 lg:px-8 pt-1.5 sm:pt-2.5 pb-1.5 border-b border-[#cfbe9e]/60 flex items-center justify-between gap-2 bg-[#f8f1df]/40 shrink-0">
                <div>
                    <div className="text-[9px] sm:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold">
                        Bab Ketiga · Album Kenangan
                    </div>
                    <h2 className="font-cinzel text-xs sm:text-lg md:text-xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight truncate">
                        Arsip Visual & Foto Fisik
                    </h2>
                </div>

                <button
                    onClick={onOpenContribute}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-[#472d17] hover:bg-[#633f20] text-[#f7e8cf] rounded text-[10px] sm:text-xs font-cinzel tracking-wider transition-colors shadow-xs cursor-pointer font-bold shrink-0"
                >
                    <Plus className="w-3.5 h-3.5 text-[#e2b774]" />
                    <span>Tempel Foto</span>
                </button>
            </div>

            {/* Pages Container: Left Page and Right Page (1 page on mobile, 2 pages on desktop) */}
            <div className="flex-1 flex flex-row overflow-hidden w-full h-full">
                {/* LEFT PAGE */}
                <div
                    className={`${mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
                        } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between overflow-y-auto book-scroll`}
                >
                    <div className="flex-1 flex flex-col items-center justify-center p-1 py-1 my-auto overflow-hidden">
                        {leftPhoto ? (
                            <PhysicalPhotoItem
                                photo={leftPhoto}
                                onClick={() => onSelectPhoto(leftPhoto)}
                            />
                        ) : (
                            <div className="py-10 text-center text-xs font-source-serif italic text-[#78593a]">
                                Lembaran album foto kosong.
                            </div>
                        )}
                    </div>

                    {/* Left Footer */}
                    <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-1">
                        <ArchivalStamp text="ARSIP FOTOGRAFI" year="2008" color="sepia" />
                        <span>Hal. {String(10 + safePageIndex * 2).padStart(2, '0')}</span>
                    </div>
                </div>

                {/* RIGHT PAGE */}
                <div
                    className={`${mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
                        } w-full md:w-1/2 h-full p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between overflow-y-auto book-scroll`}
                >
                    <div className="flex-1 flex flex-col items-center justify-center p-1 py-1 my-auto overflow-hidden">
                        {rightPhoto ? (
                            <PhysicalPhotoItem
                                photo={rightPhoto}
                                onClick={() => onSelectPhoto(rightPhoto)}
                            />
                        ) : (
                            <div className="py-10 text-center text-xs font-source-serif italic text-[#78593a]">
                                Klik tombol &ldquo;Tempel Foto&rdquo; untuk mengisi lembaran ini.
                            </div>
                        )}
                    </div>

                    {/* Right Footer with Leaf Navigation */}
                    <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-1">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <button
                                onClick={handlePrevLeaf}
                                disabled={safePageIndex === 0}
                                className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded border border-[#bfa683] text-[9.5px] sm:text-xs font-cinzel transition-all ${safePageIndex === 0
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'bg-[#ede1c7] hover:bg-[#dfd0b5] text-[#422610] cursor-pointer'
                                    }`}
                            >
                                <ChevronLeft className="w-3 h-3" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </button>

                            <span className="font-source-serif text-[9.5px] sm:text-xs text-[#6e4e2a] px-0.5 font-semibold">
                                Lembar {safePageIndex + 1}/{totalPhotoPages}
                            </span>

                            <button
                                onClick={handleNextLeaf}
                                disabled={safePageIndex >= totalPhotoPages - 1}
                                className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded border border-[#bfa683] text-[9.5px] sm:text-xs font-cinzel transition-all ${safePageIndex >= totalPhotoPages - 1
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'bg-[#ede1c7] hover:bg-[#dfd0b5] text-[#422610] cursor-pointer'
                                    }`}
                            >
                                <span className="hidden sm:inline">Berikutnya</span>
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        <span>Hal. {String(11 + safePageIndex * 2).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
Spread3Photos.displayName = 'Spread3Photos';

const PhysicalPhotoItem = memo<{
    photo: MemoryPhoto;
    onClick: () => void;
}>(({ photo, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                transform: `rotate(${photo.tilt}deg)`,
            }}
            className="group relative cursor-pointer transition-transform duration-300 hover:scale-[1.01] hover:z-20 p-1.5 sm:p-2.5 bg-[#fdfaf3] rounded-lg shadow-sm border border-[#d6c7ab] w-full max-w-sm mx-auto"
        >
            {photo.mounting === 'tape' && <VintageWashiTape position="top" />}
            {photo.mounting === 'corners' && <PhotoCorners />}
            {photo.mounting === 'polaroid' && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#8c2d19]/80 shadow-xs" />
            )}

            {/* Photo Frame Container */}
            <div className="relative aspect-[16/10] max-h-[22vh] sm:max-h-[28vh] md:max-h-[34vh] w-full overflow-hidden bg-[#e0d3bc] border border-[#a48662] rounded-xs shadow-inner">
                <img
                    src={photo.photoUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover grayscale contrast-115 sepia-[0.35] group-hover:sepia-0 group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] pointer-events-none" />
            </div>

            {/* Handwritten Caption & Metadata */}
            <div className="mt-1.5 px-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h3 className="font-cinzel text-[10.5px] sm:text-xs md:text-sm font-bold text-[#321f10] group-hover:text-[#804c1e] transition-colors leading-tight truncate">
                        {photo.title}
                    </h3>
                    <span className="text-[9px] sm:text-xs font-source-serif font-bold text-[#805e3b] shrink-0">
                        {photo.year} · {photo.location}
                    </span>
                </div>

                <p className="font-handwritten text-xs sm:text-sm md:text-base text-[#543b23] leading-snug mt-0.5 line-clamp-2">
                    &ldquo;{photo.caption}&rdquo;
                </p>

                <div className="mt-1 pt-0.5 border-t border-[#e2d5bd] flex items-center justify-between text-[9.5px] sm:text-xs font-source-serif text-[#785b3e]">
                    <span className="truncate font-medium">
                        Oleh: {photo.uploaderName} {photo.uploaderKunya ? `(${photo.uploaderKunya})` : ''}
                    </span>

                    {photo.marginNotes.length > 0 && (
                        <div className="flex items-center gap-1 font-handwritten text-[11px] sm:text-xs text-[#82471b] shrink-0 font-bold ml-1.5">
                            <MessageSquare className="w-3 h-3" />
                            <span>{photo.marginNotes.length} coretan</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
PhysicalPhotoItem.displayName = 'PhysicalPhotoItem';
