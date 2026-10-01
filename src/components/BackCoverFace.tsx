import React, { memo } from 'react';
import { CornerFiligree } from './Ornaments';

interface BackCoverFaceProps {
    className?: string;
}

export const BackCoverFace = memo<BackCoverFaceProps>(({
    className = '',
}) => {
    return (
        <div
            className={`relative w-full h-full rounded-l-2xl rounded-r-sm leather-dark p-3 sm:p-5 md:p-6 overflow-hidden border-t border-l border-[#722734]/50 border-b border-[#290a10] ${className}`}
            style={{
                boxShadow:
                    'inset 0 0 140px rgba(0,0,0,0.98), 0 35px 70px -15px rgba(0,0,0,0.95)',
            }}
        >
            {/* 1. Underlying Base Leather Texture Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#ffd700]/[0.04] to-transparent pointer-events-none" />

            {/* 2. Embedded Artwork Image (Darkened & Blended so lines are distinct on rich leather) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* The artwork image: darker, high contrast for crisp linework, blended with leather */}
                <img
                    src="/sampulbelakang.png"
                    alt="Sampul Belakang Buku"
                    className="w-full h-full object-cover object-center select-none filter brightness-50 contrast-135 opacity-60 mix-blend-overlay"
                    loading="eager"
                />

                {/* Secondary Linework Detail Layer to ensure the lines pop against the dark leather */}
                <img
                    src="/sampulbelakang.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center select-none filter brightness-45 contrast-140 opacity-40 mix-blend-screen"
                />

                {/* Rich Dark Oxblood Vignette Overlay to merge the image seamlessly into the book casing */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 50% 50%, rgba(35, 10, 14, 0.45) 0%, rgba(18, 5, 8, 0.88) 75%, rgba(10, 2, 4, 0.98) 100%)',
                    }}
                />
            </div>

            {/* 3. Double Gold-Embossed Outer Border (Harmonized with Front Cover) */}
            <div className="absolute inset-2 sm:inset-4 md:inset-5 border-2 border-[#caa35c]/70 rounded-l-xl rounded-r-xs pointer-events-none shadow-[0_0_3px_rgba(0,0,0,0.95)]" />
            <div className="absolute inset-3.5 sm:inset-6 md:inset-7 border border-[#caa35c]/40 rounded-l-lg pointer-events-none border-dashed" />

            {/* 4. Four Antique Gold Filigree Corners */}
            <CornerFiligree position="top-left" className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
            <CornerFiligree position="top-right" className="absolute top-2.5 sm:top-5 right-2.5 sm:right-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
            <CornerFiligree position="bottom-left" className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
            <CornerFiligree position="bottom-right" className="absolute bottom-2.5 sm:bottom-5 right-2.5 sm:right-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />

            {/* 5. Center Soft Warm Gilded Sheen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(202,163,92,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* 6. Heavy Brass Clasp Accent on Left Edge */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 sm:w-5 h-16 sm:h-24 bg-gradient-to-l from-[#916b2c] via-[#ecd38e] to-[#704d16] rounded-r-md border-y border-r border-[#59390a] shadow-2xl flex flex-col items-center justify-around py-2 pointer-events-none z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3a1d06] shadow-inner" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#3a1d06] shadow-inner" />
            </div>
        </div>
    );
});
BackCoverFace.displayName = 'BackCoverFace';
