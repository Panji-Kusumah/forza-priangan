import React, { useState, useRef, memo } from 'react';
import { CornerFiligree, BookCrest } from './Ornaments';
import { BackCoverFace } from './BackCoverFace';
import { playPageFlipSound } from '../utils/audio';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

interface ClosedBookProps {
    onOpen: () => void;
    isOpening: boolean;
    initialCoverSide?: 'front' | 'back';
}

export const ClosedBook = memo<ClosedBookProps>(({
    onOpen,
    isOpening,
    initialCoverSide = 'front',
}) => {
    const [rotate, setRotate] = useState({ x: 4, y: initialCoverSide === 'front' ? -6 : 6 });
    const [isHovered, setIsHovered] = useState(false);
    const [coverSide, setCoverSide] = useState<'front' | 'back'>(initialCoverSide);
    const [isFlippingCover, setIsFlippingCover] = useState(false);
    const bookRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const flipTimer1Ref = useRef<number | null>(null);
    const flipTimer2Ref = useRef<number | null>(null);

    React.useEffect(() => {
        setCoverSide(initialCoverSide);
        setRotate({ x: 4, y: initialCoverSide === 'front' ? -6 : 6 });
    }, [initialCoverSide]);

    React.useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (flipTimer1Ref.current) window.clearTimeout(flipTimer1Ref.current);
            if (flipTimer2Ref.current) window.clearTimeout(flipTimer2Ref.current);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOpening || isFlippingCover) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            setRotate({
                x: -y * 0.022 + 3,
                y: x * 0.032 - (coverSide === 'front' ? 5 : -5),
            });
        });
    };

    const handleMouseLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setIsHovered(false);
        setRotate({ x: 4, y: coverSide === 'front' ? -6 : 6 });
    };

    const handleToggleCoverSide = () => {
        if (isOpening || isFlippingCover) return;
        setIsFlippingCover(true);
        playPageFlipSound();

        if (flipTimer1Ref.current) window.clearTimeout(flipTimer1Ref.current);
        if (flipTimer2Ref.current) window.clearTimeout(flipTimer2Ref.current);

        flipTimer1Ref.current = window.setTimeout(() => {
            setCoverSide((prev) => (prev === 'front' ? 'back' : 'front'));
            setRotate({ x: 4, y: coverSide === 'front' ? 6 : -6 });
        }, 220);

        flipTimer2Ref.current = window.setTimeout(() => {
            setIsFlippingCover(false);
        }, 450);
    };

    // Cukup klik di area sampul belakang maka kembali ke sampul depan; jika di sampul depan maka buka buku
    const handleBookClick = () => {
        if (isOpening || isFlippingCover) return;
        if (coverSide === 'back') {
            handleToggleCoverSide();
        } else {
            onOpen();
        }
    };

    // Hammer.js gesture hook mapping swipe events to open or flip book covers
    useSwipeGesture(bookRef, {
        onSwipeLeft: () => {
            if (coverSide === 'front') {
                onOpen();
            } else {
                handleToggleCoverSide();
            }
        },
        onSwipeRight: () => {
            handleToggleCoverSide();
        },
        enabled: !isOpening && !isFlippingCover,
    });

    return (
        <div
            className="relative w-full min-h-screen flex flex-col items-center justify-center p-2 sm:p-6 md:p-8 perspective-2000 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Library Desk Ambience */}
            <div className="absolute inset-0 bg-[#0e0704] pointer-events-none">
                {/* Warm overhead candle/oil lamp spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(195,135,55,0.18)_0%,rgba(90,45,15,0.08)_50%,transparent_75%)] blur-2xl" />
                {/* Subtle wood table grain */}
                <div
                    className="absolute inset-0 opacity-25 mix-blend-overlay"
                    style={{
                        backgroundImage: `radial-gradient(ellipse at 50% 60%, rgba(140, 80, 30, 0.4) 0%, transparent 80%), repeating-linear-gradient(90deg, rgba(30,15,8,0.5) 0px, rgba(30,15,8,0.5) 2px, transparent 2px, transparent 80px)`,
                    }}
                />
            </div>

            {/* Main 3D Hardcover Book Container: Fully responsive across PC, Tablet & Mobile */}
            <div
                ref={bookRef}
                onClick={handleBookClick}
                style={{
                    transform: isOpening
                        ? coverSide === 'front'
                            ? 'rotateY(-85deg) translateZ(60px) scale(1.05)'
                            : 'rotateY(85deg) translateZ(60px) scale(1.05)'
                        : isFlippingCover
                            ? 'rotateY(90deg) scale(0.96)'
                            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
                    transition: isOpening
                        ? 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 1.1s ease'
                        : isFlippingCover
                            ? 'transform 0.22s ease-in'
                            : isHovered
                                ? 'none'
                                : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                }}
                className={`group relative cursor-pointer transform-style-3d select-none z-10 w-[min(480px,80vw)] sm:w-[420px] md:w-[460px] lg:w-[490px] h-[86dvh] sm:h-[84dvh] max-h-[720px] min-h-[420px] ${coverSide === 'front' ? 'rounded-r-2xl rounded-l-md' : 'rounded-l-2xl rounded-r-md'
                    }`}
            >
                {/* Massive Multi-Layered Book Drop Shadow onto Desk */}
                <div
                    className="absolute -inset-5 sm:-inset-7 rounded-3xl bg-black/95 blur-2xl -z-20 pointer-events-none"
                    style={{
                        transform: `translate(${rotate.y * -2.2 + 25}px, ${Math.max(30, rotate.x * 2.8 + 40)}px) scale(0.96)`,
                    }}
                />
                <div
                    className="absolute -inset-3 sm:-inset-4 rounded-2xl bg-[#0a0402]/80 blur-lg -z-10 pointer-events-none"
                    style={{
                        transform: `translate(${rotate.y * -1.2 + 12}px, ${Math.max(16, rotate.x * 1.5 + 20)}px)`,
                    }}
                />

                {coverSide === 'front' ? (
                    <>
                        {/* Substantial Heavy Book Spine (Left side for Front Cover) */}
                        <div
                            className="absolute top-0 -left-7 sm:-left-10 md:-left-14 w-7 sm:w-10 md:w-14 h-full bg-[#160608] rounded-l-lg border-r border-[#3a151b] transform origin-right -rotate-y-90 z-20 flex flex-col justify-between py-5 sm:py-8 items-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(75,22,29,0.85) 35%, rgba(15,4,6,0.98) 100%)`,
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((rib) => (
                                <div
                                    key={rib}
                                    className="w-full h-2.5 sm:h-4 md:h-5 border-y border-[#caa35c]/60 bg-gradient-to-r from-[#1b080b] via-[#7a2533] to-[#120406] shadow-[0_3px_6px_rgba(0,0,0,0.9)] flex items-center justify-center"
                                >
                                    <div className="w-2/3 h-0.5 bg-[#fad783]/50 rounded-full" />
                                </div>
                            ))}
                            <div className="text-[9px] sm:text-xs md:text-sm font-cinzel font-black text-[#deb367] tracking-[0.34em] uppercase [writing-mode:vertical-rl] rotate-180 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
                                KONSULAT PRIANGAN · MARHALAH 2008 · FORZA YOUTH
                            </div>
                        </div>

                        {/* Gilded Layered Page Block Edge (Right side thickness) */}
                        <div
                            className="absolute top-2 right-[-24px] sm:right-[-38px] md:right-[-48px] w-[26px] sm:w-[40px] md:w-[50px] h-[calc(100%-16px)] rounded-r-md z-0 transform origin-left rotate-y-90"
                            style={{
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.85)',
                                backgroundImage: `repeating-linear-gradient(0deg, #684923 0px, #684923 1.5px, #d8b86d 1.5px, #d8b86d 3px, #f5e8be 3px, #f5e8be 4.5px, #aa7f3c 4.5px, #aa7f3c 6px), linear-gradient(to right, #5c3f1d 0%, #c99e52 25%, #f4e2a8 50%, #a67c3b 75%, #3a220c 100%)`,
                            }}
                        />

                        {/* Hardcover Front Face */}
                        <div
                            className="relative w-full h-full rounded-r-2xl rounded-l-sm leather-dark p-3 sm:p-5 md:p-7 flex flex-col justify-between border-t border-r border-[#722734]/50 border-b border-[#290a10] shadow-[inset_0_0_100px_rgba(0,0,0,0.95)] overflow-hidden"
                            style={{
                                boxShadow:
                                    'inset 0 0 140px rgba(0,0,0,0.98), 0 35px 70px -15px rgba(0,0,0,0.95)',
                            }}
                        >
                            {/* Subtle Leather Texture Sheen */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffd700]/[0.05] to-transparent pointer-events-none" />

                            {/* Double Gold-Embossed Outer Border */}
                            <div className="absolute inset-2 sm:inset-4 md:inset-5 border-2 border-[#caa35c]/70 rounded-r-xl rounded-l-xs pointer-events-none shadow-[0_0_3px_rgba(0,0,0,0.95)]" />
                            <div className="absolute inset-3.5 sm:inset-6 md:inset-7 border border-[#caa35c]/40 rounded-r-lg pointer-events-none border-dashed" />

                            {/* Four Antique Gold Filigree Corners */}
                            <CornerFiligree position="top-left" className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
                            <CornerFiligree position="top-right" className="absolute top-2.5 sm:top-5 right-2.5 sm:right-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
                            <CornerFiligree position="bottom-left" className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />
                            <CornerFiligree position="bottom-right" className="absolute bottom-2.5 sm:bottom-5 right-2.5 sm:right-5 w-8 sm:w-14 md:w-18 h-8 sm:h-14 md:h-18" />

                            {/* Book Header Title */}
                            <div className="relative text-center pt-4 sm:pt-6 md:pt-7 px-3 sm:px-5 max-w-[86%] mx-auto z-10 shrink-0">
                                {/* Pembukaan: Basmalah (positioned cleanly below the decorative top border) */}
                                <div className="font-arabic text-xs sm:text-sm md:text-base lg:text-lg text-[#f7dc9f] tracking-wide font-bold drop-shadow-md mb-1 sm:mb-1.5">
                                    بِاسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                                </div>

                                <div className="text-base sm:text-xl md:text-2xl lg:text-[30px] font-cinzel font-black tracking-[0.11em] sm:tracking-[0.13em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff5d0] via-[#e5b75f] to-[#996d24] drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] leading-tight">
                                    MARHALAH 2008
                                </div>

                                <div className="mt-0.5 font-cinzel-decorative font-bold text-[10px] sm:text-xs md:text-base lg:text-lg tracking-[0.11em] sm:tracking-[0.13em] text-[#fad783] drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)]">
                                    FORZA YOUTH GENERATION
                                </div>

                                {/* Ornamental Divider */}
                                <div className="my-1 sm:my-1.5 flex items-center justify-center gap-2 sm:gap-2.5 text-[#caa35c]">
                                    <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-[#caa35c]/70" />
                                    <span className="text-[7px] sm:text-[9px] text-[#e5b75f]">✦</span>
                                    <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-[#caa35c]/70" />
                                </div>

                                {/* Konsulat Periangan */}
                                <div className="font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-[0.24em] sm:tracking-[0.28em] text-[#f7e0b5] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                    KONSULAT PERIANGAN
                                </div>

                                {/* Elegant Thin Gold Decorative Separator */}
                                <div className="my-1 sm:my-1.5 flex items-center justify-center gap-1.5 sm:gap-2 text-[#caa35c]">
                                    <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#caa35c]/50 to-[#e5b75f]/85" />
                                    <span className="text-[6.5px] sm:text-[8px] text-[#fad783] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">◈</span>
                                    <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#caa35c]/50 to-[#e5b75f]/85" />
                                </div>

                                {/* Wilayah Daerah Priangan */}
                                <div className="mt-0.5 flex items-center justify-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-[8.5px] sm:text-[10px] md:text-[11px] font-source-serif italic tracking-wider text-[#d6b074] drop-shadow-xs">
                                    <span>Bandung Raya</span>
                                    <span className="text-[#a47e45] text-[7px] not-italic">·</span>
                                    <span>Sumedang</span>
                                    <span className="text-[#a47e45] text-[7px] not-italic">·</span>
                                    <span>Garut</span>
                                    <span className="text-[#a47e45] text-[7px] not-italic">·</span>
                                    <span>Tasik</span>
                                    <span className="text-[#a47e45] text-[7px] not-italic">·</span>
                                    <span>Ciamis</span>
                                </div>
                            </div>

                            {/* Center Emblem */}
                            <div className="relative my-auto flex flex-col items-center justify-center py-1 sm:py-2 z-10 shrink-0">
                                <BookCrest className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transform transition-transform duration-500 group-hover:scale-105" />
                            </div>

                            {/* Book Footer */}
                            <div className="relative text-center pb-1 sm:pb-2 z-10 flex flex-col items-center shrink-0">
                                <div className="text-[10px] sm:text-xs md:text-sm font-cinzel font-bold tracking-[0.18em] text-[#fad783]/95 uppercase">
                                    Pondok Modern Darussalam Gontor
                                </div>

                                <div className="mt-0.5 text-[9px] sm:text-[11px] md:text-xs font-source-serif italic text-[#deb579] tracking-wider">
                                    Ponorogo · Jawa Timur · Indonesia
                                </div>
                            </div>

                            {/* Book Clasp on Right Edge */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 sm:w-5 h-16 sm:h-24 bg-gradient-to-r from-[#916b2c] via-[#ecd38e] to-[#704d16] rounded-l-md border-y border-l border-[#59390a] shadow-2xl flex flex-col items-center justify-around py-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3a1d06] shadow-inner" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3a1d06] shadow-inner" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Substantial Heavy Book Spine (Right side for Back Cover) */}
                        <div
                            className="absolute top-0 -right-7 sm:-right-10 md:-right-14 w-7 sm:w-10 md:w-14 h-full bg-[#160608] rounded-r-lg border-l border-[#3a151b] transform origin-left rotate-y-90 z-20 flex flex-col justify-between py-5 sm:py-8 items-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
                            style={{
                                backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(75,22,29,0.85) 35%, rgba(15,4,6,0.98) 100%)`,
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((rib) => (
                                <div
                                    key={rib}
                                    className="w-full h-2.5 sm:h-4 md:h-5 border-y border-[#caa35c]/60 bg-gradient-to-r from-[#120406] via-[#7a2533] to-[#1b080b] shadow-[0_3px_6px_rgba(0,0,0,0.9)] flex items-center justify-center"
                                >
                                    <div className="w-2/3 h-0.5 bg-[#fad783]/50 rounded-full" />
                                </div>
                            ))}
                            <div className="text-[9px] sm:text-xs md:text-sm font-cinzel font-black text-[#deb367] tracking-[0.34em] uppercase [writing-mode:vertical-rl] drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
                                KONSULAT PRIANGAN · MARHALAH 2008 · FORZA YOUTH
                            </div>
                        </div>

                        {/* Gilded Layered Page Block Edge (Left side thickness for Back Cover) */}
                        <div
                            className="absolute top-2 left-[-24px] sm:left-[-38px] md:left-[-48px] w-[26px] sm:w-[40px] md:w-[50px] h-[calc(100%-16px)] rounded-l-md z-0 transform origin-right -rotate-y-90"
                            style={{
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.85)',
                                backgroundImage: `repeating-linear-gradient(0deg, #684923 0px, #684923 1.5px, #d8b86d 1.5px, #d8b86d 3px, #f5e8be 3px, #f5e8be 4.5px, #aa7f3c 4.5px, #aa7f3c 6px), linear-gradient(to left, #5c3f1d 0%, #c99e52 25%, #f4e2a8 50%, #a67c3b 75%, #3a220c 100%)`,
                            }}
                        />

                        {/* Hardcover Back Face Component */}
                        <BackCoverFace />
                    </>
                )}

                {/* Bottom Gilded Page Block Edge */}
                <div
                    className="absolute -bottom-6 sm:-bottom-8 left-1 w-full h-6 sm:h-8 rounded-b-md z-0 transform origin-top rotate-x-90"
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, #684923 0px, #684923 1.5px, #d8b86d 1.5px, #d8b86d 3px, #f5e8be 3px, #f5e8be 4.5px, #aa7f3c 4.5px, #aa7f3c 6px), linear-gradient(to bottom, #684923 0%, #caa45d 40%, #f4e2a8 60%, #3a220c 100%)`,
                    }}
                />
            </div>
        </div>
    );
});
ClosedBook.displayName = 'ClosedBook';
