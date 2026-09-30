import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Alumnus, MemoryPhoto, SignatureEntry } from '../types';
import { Spread0Cover } from './spreads/Spread0Cover';
import { Spread1Story } from './spreads/Spread1Story';
import { Spread1StoryPart2 } from './spreads/Spread1StoryPart2';
import { Spread2Alumni } from './spreads/Spread2Alumni';
import { Spread3Photos } from './spreads/Spread3Photos';
import { Spread4Signatures } from './spreads/Spread4Signatures';
import { Spread5Contribute } from './spreads/Spread5Contribute';
import { playPageFlipSound, playBookCloseSound, toggleAudioMute, getAudioMuted } from '../utils/audio';
import { getParchmentTurnPhysics, ParchmentPhysics } from '../utils/paperPhysics';
import { ChevronLeft, ChevronRight, Book, Volume2, VolumeX, Bookmark } from 'lucide-react';
import { CornerFiligree } from './Ornaments';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

interface OpenBookProps {
  onCloseBook: (targetSide?: 'front' | 'back') => void;
  alumniList: Alumnus[];
  photos: MemoryPhoto[];
  signatures: SignatureEntry[];
  onSelectAlumnus: (alumnus: Alumnus) => void;
  onSelectPhoto: (photo: MemoryPhoto) => void;
  onAddSignature: (entry: Omit<SignatureEntry, 'id' | 'date'>) => void;
  onAddAlumnus: (alumnus: Alumnus) => void;
  onAddMemoryPhoto: (photo: MemoryPhoto) => void;
}

const CHAPTERS = [
  { title: 'Daftar Bab & Maklumat', spread: 0 },
  { title: 'Bab I: Falsafah Logo (Bagian 1)', spread: 1 },
  { title: 'Bab I: Falsafah Logo (Bagian 2)', spread: 2 },
  { title: "Bab II: Sijillul Asma' (Sahabat Alumni)", spread: 3 },
  { title: 'Bab III: Album Kenangan', spread: 4 },
  { title: 'Bab IV: Catatan Tepi & Autograph', spread: 5 },
  { title: 'Bab V: Tinta Baru (Hal. 14-15)', spread: 6 },
] as const;

const TOTAL_SPREADS = 7;

export const OpenBook = memo<OpenBookProps>(({
  onCloseBook,
  alumniList,
  photos,
  signatures,
  onSelectAlumnus,
  onSelectPhoto,
  onAddSignature,
  onAddAlumnus,
  onAddMemoryPhoto,
}) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [muted, setMuted] = useState(getAudioMuted());
  const [showRibbonMenu, setShowRibbonMenu] = useState(false);

  const totalSpreads = TOTAL_SPREADS;
  const chapters = CHAPTERS;
  const [currentPhysics, setCurrentPhysics] = useState<ParchmentPhysics>(() =>
    getParchmentTurnPhysics(0, TOTAL_SPREADS, 'next')
  );

  // Mobile 1-page per screen vs Desktop 2-page spread
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  const [mobilePageSide, setMobilePageSide] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const midpointTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (midpointTimerRef.current) window.clearTimeout(midpointTimerRef.current);
      if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);
    };
  }, []);

  const handleClose = useCallback(
    (targetSide: 'front' | 'back' = 'front') => {
      if (midpointTimerRef.current) window.clearTimeout(midpointTimerRef.current);
      if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);
      playBookCloseSound();
      onCloseBook(targetSide);
    },
    [onCloseBook]
  );

  const goToSpread = useCallback(
    (targetSpread: number, targetSide: 'left' | 'right' = 'left') => {
      if (isFlipping) return;
      if (targetSpread < 0 || targetSpread >= TOTAL_SPREADS) return;

      if (midpointTimerRef.current) window.clearTimeout(midpointTimerRef.current);
      if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);

      const direction =
        targetSpread > currentSpread
          ? 'next'
          : targetSpread < currentSpread
          ? 'prev'
          : targetSide === 'right'
          ? 'next'
          : 'prev';

      const physics = getParchmentTurnPhysics(currentSpread, TOTAL_SPREADS, direction);
      setCurrentPhysics(physics);
      setFlipDirection(direction);
      setIsFlipping(true);
      playPageFlipSound(physics.snapIntensity);

      // Seamless midpoint swap precisely when turning paper leaf is at 90° edge-on to the eye
      midpointTimerRef.current = window.setTimeout(() => {
        setCurrentSpread(targetSpread);
        setMobilePageSide(targetSide);
      }, physics.midpointMs);

      // Completion when page has settled smoothly onto the destination side with spring rebound
      completeTimerRef.current = window.setTimeout(() => {
        setIsFlipping(false);
      }, physics.durationMs);
    },
    [isFlipping, currentSpread]
  );

  const handleNext = useCallback(() => {
    if (isMobile) {
      if (mobilePageSide === 'left') {
        goToSpread(currentSpread, 'right');
      } else {
        if (currentSpread < TOTAL_SPREADS - 1) {
          goToSpread(currentSpread + 1, 'left');
        } else {
          handleClose('back');
        }
      }
    } else {
      if (currentSpread < TOTAL_SPREADS - 1) {
        goToSpread(currentSpread + 1);
      } else {
        handleClose('back');
      }
    }
  }, [isMobile, mobilePageSide, currentSpread, goToSpread, handleClose]);

  const handlePrev = useCallback(() => {
    if (isMobile) {
      if (mobilePageSide === 'right') {
        goToSpread(currentSpread, 'left');
      } else {
        if (currentSpread > 0) {
          goToSpread(currentSpread - 1, 'right');
        } else {
          handleClose('front');
        }
      }
    } else {
      if (currentSpread > 0) {
        goToSpread(currentSpread - 1);
      } else {
        handleClose('front');
      }
    }
  }, [isMobile, mobilePageSide, currentSpread, goToSpread, handleClose]);

  // Mobile & Desk Touch Container Ref
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // Hammer.js gesture hook mapping swipe events to page turning logic on mobile
  useSwipeGesture(bookContainerRef, {
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
    threshold: 20,
    velocity: 0.22,
  });

  // Accessible keyboard shortcuts (ArrowLeft / ArrowRight / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose('front');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, isMobile, mobilePageSide]);

  const handleSoundToggle = useCallback(() => {
    const state = toggleAudioMute();
    setMuted(state);
  }, []);

  return (
    <div
      ref={bookContainerRef}
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-screen min-h-screen flex flex-col items-center justify-center p-1 sm:p-2 md:p-3 overflow-hidden select-none bg-[#0e0704]"
    >
      {/* Background Library Desk Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1000px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(195,135,55,0.18)_0%,rgba(90,45,15,0.06)_50%,transparent_75%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 60%, rgba(140, 80, 30, 0.45) 0%, transparent 80%), repeating-linear-gradient(90deg, rgba(30,15,8,0.5) 0px, rgba(30,15,8,0.5) 2px, transparent 2px, transparent 80px)`,
          }}
        />
      </div>

      {/* Main Physical Book Container:
          Consistent two-page spread across Desktop, Tablet & Mobile */}
      <div className="relative z-20 w-[96vw] max-w-[1560px] h-[92dvh] max-h-[960px] flex items-center justify-center">
        {/* Desk Drop Shadow */}
        <div className="absolute inset-1 sm:inset-3 rounded-3xl bg-black/95 blur-2xl -z-10 shadow-[0_30px_90px_rgba(0,0,0,0.95)]" />

        {/* Physical Leather Outer Casing framing the pages */}
        <div className="relative w-full h-full leather-dark p-1 sm:p-2 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-[#522b13] shadow-[0_30px_80px_rgba(0,0,0,0.98)] flex flex-col justify-between overflow-hidden">
          {/* Top Integrated Leather Hardware Trim */}
          <div className="relative z-40 w-full pb-1 sm:pb-2 px-1.5 sm:px-3 md:px-4 flex items-center justify-between text-[#d6b782] border-b border-[#522b13]/60 shrink-0">
            {/* Left: Antique Brass "Tutup Buku" Clasp */}
            <button
              onClick={() => handleClose(currentSpread === totalSpreads - 1 ? 'back' : 'front')}
              className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded border border-[#7a4823]/70 hover:border-[#caa35c] bg-[#24100c]/90 hover:bg-[#381a13] text-[#f7e0b5] transition-all text-xs sm:text-sm font-cinzel font-bold tracking-wider cursor-pointer shadow-xs shrink-0"
              title={currentSpread === totalSpreads - 1 ? 'Tutup ke sampul belakang' : 'Tutup ke sampul depan'}
            >
              <Book className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#caa35c] group-hover:scale-110 transition-transform" />
              <span>Tutup</span>
            </button>

            {/* Center: Gilded Spine Inscription & Chapter Title with Logo */}
            <div className="flex items-center gap-2 max-w-[180px] sm:max-w-[320px] md:max-w-md lg:max-w-none">
              <img
                src="/logokonsul.png"
                alt="Logo Konsulat"
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain drop-shadow-sm shrink-0"
              />
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left truncate">
                <span className="font-cinzel text-[11px] sm:text-sm md:text-base font-bold tracking-[0.14em] sm:tracking-[0.22em] text-[#f0d49e] uppercase drop-shadow-xs truncate">
                  {chapters[currentSpread]?.title}
                </span>
                <span className="hidden lg:inline font-source-serif text-xs text-[#b89569] italic truncate">
                  Gontor Alumni · Konsulat Priangan Youth Generation · Marhalah 2008 (Forza Youth)
                </span>
              </div>
            </div>

            {/* Right: Chapter Ribbon Quick Jump & Audio Toggle */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* Ribbon Selector Button */}
              <div className="relative">
                <button
                  onClick={() => setShowRibbonMenu(!showRibbonMenu)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded border border-[#7a4823]/70 hover:border-[#caa35c] bg-[#24100c]/90 hover:bg-[#381a13] text-[#f7e0b5] text-xs sm:text-sm font-cinzel font-semibold cursor-pointer shadow-xs"
                  title="Buka daftar bab buku"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#ba3131]" />
                  <span className="hidden sm:inline">Pita Bab</span>
                </button>

                {showRibbonMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 max-h-[65vh] overflow-y-auto book-scroll p-2 rounded-md bg-[#220e0b] border-2 border-[#7a4823] shadow-2xl z-50 space-y-1">
                    <div className="text-xs font-cinzel uppercase tracking-wider text-[#d4ad63] px-3 py-1.5 border-b border-[#4d2813] font-bold">
                      Daftar Lembaran Bab
                    </div>
                    {chapters.map((ch) => (
                      <button
                        key={ch.spread}
                        onClick={() => {
                          goToSpread(ch.spread);
                          setShowRibbonMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-xs sm:text-sm font-cinzel transition-colors cursor-pointer ${
                          currentSpread === ch.spread
                            ? 'bg-[#57271c] text-[#fbebd0] font-bold'
                            : 'text-[#d4b585] hover:bg-[#381a13]'
                        }`}
                      >
                        {ch.title}
                      </button>
                    ))}
                    <div className="pt-1.5 mt-1 border-t border-[#4d2813]">
                      <button
                        onClick={() => {
                          setShowRibbonMenu(false);
                          handleClose('back');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded text-xs sm:text-sm font-cinzel text-[#fad783] hover:bg-[#381a13] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Book className="w-3.5 h-3.5 text-[#caa35c]" />
                        <span>Tutup ke Sampul Belakang</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={handleSoundToggle}
                className="p-1 sm:p-1.5 rounded border border-[#7a4823]/70 hover:border-[#caa35c] bg-[#24100c]/90 hover:bg-[#381a13] text-[#f7e0b5] cursor-pointer shadow-xs"
                title={muted ? 'Nyalakan Suara Buku' : 'Matikan Suara'}
              >
                {muted ? <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#a86536]" /> : <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#e5b364]" />}
              </button>
            </div>
          </div>

          {/* Golden Corner Filigree on Leather Case */}
          <div className="absolute top-2 left-2 w-7 sm:w-10 h-7 sm:h-10 border-t-2 border-l-2 border-[#caa35c]/70 rounded-tl-xs pointer-events-none" />
          <div className="absolute top-2 right-2 w-7 sm:w-10 h-7 sm:h-10 border-t-2 border-r-2 border-[#caa35c]/70 rounded-tr-xs pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-7 sm:w-10 h-7 sm:h-10 border-b-2 border-l-2 border-[#caa35c]/70 rounded-bl-xs pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-7 sm:w-10 h-7 sm:h-10 border-b-2 border-r-2 border-[#caa35c]/70 rounded-br-xs pointer-events-none" />

          {/* The Inner Parchment Spread:
              1 Single Full Page on Mobile vs Two Pages side-by-side on Desktop */}
          <div
            className="relative flex-1 w-full parchment-texture rounded-lg border border-[#cfbe9e] shadow-[inset_0_0_80px_rgba(110,80,40,0.35)] flex overflow-hidden perspective-2000"
          >
            {/* Central Book Spine Gutter Shadow - Visible in Desktop Spread Mode */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-14 lg:w-20 z-25 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(95,65,30,0.38) 38%, rgba(55,35,15,0.75) 50%, rgba(95,65,30,0.38) 62%, rgba(0,0,0,0) 100%)',
              }}
            />

            {/* Mobile Spine Binding Shadow (Left Bound Edge) */}
            <div className="md:hidden absolute top-0 bottom-0 left-0 w-3.5 pointer-events-none bg-gradient-to-r from-black/30 via-black/10 to-transparent z-25" />

            {/* Page Curvature Edge Shadow */}
            <div className="absolute inset-y-0 left-0 w-3 sm:w-8 pointer-events-none bg-gradient-to-r from-black/20 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-3 sm:w-8 pointer-events-none bg-gradient-to-l from-black/20 to-transparent z-10" />

            {/* Active Content: 1 page on mobile (<md), 2 pages on desktop (>=md) */}
            <div className="w-full h-full overflow-hidden">
              {currentSpread === 0 && (
                <Spread0Cover
                  onNavigate={(idx) => goToSpread(idx, 'left')}
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 1 && (
                <Spread1Story
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 2 && (
                <Spread1StoryPart2
                  onNavigateToNextSpread={() => goToSpread(3, 'left')}
                  onNavigateToPrevSpread={() => goToSpread(1, 'left')}
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 3 && (
                <Spread2Alumni
                  alumniList={alumniList}
                  onSelectAlumnus={onSelectAlumnus}
                  onNavigateToContribute={() => goToSpread(6, 'left')}
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 4 && (
                <Spread3Photos
                  photos={photos}
                  onSelectPhoto={onSelectPhoto}
                  onOpenContribute={() => goToSpread(6, 'left')}
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 5 && (
                <Spread4Signatures
                  signatures={signatures}
                  onAddSignature={onAddSignature}
                  mobilePageSide={mobilePageSide}
                />
              )}
              {currentSpread === 6 && (
                <Spread5Contribute
                  onAddAlumnus={onAddAlumnus}
                  onAddMemoryPhoto={onAddMemoryPhoto}
                  onNavigate={(idx) => goToSpread(idx, 'left')}
                  onCloseToBackCover={() => handleClose('back')}
                  mobilePageSide={mobilePageSide}
                />
              )}
            </div>

            {/* Realistic 3D Paper Page Turn Layer with Spring Physics */}
            {isFlipping && (
              <>
                {flipDirection === 'next' ? (
                  <>
                    {/* Shadow cast on the right page underneath the lifting sheet */}
                    <div
                      className="block absolute top-0 bottom-0 right-0 w-1/2 pointer-events-none z-20 animate-under-page-shadow-next"
                      style={currentPhysics.cssStyle}
                    />
                    {/* Soft landing shadow forming on the left page */}
                    <div
                      className="block absolute top-0 bottom-0 left-0 w-1/2 pointer-events-none z-20 animate-landing-shadow-next"
                      style={currentPhysics.cssStyle}
                    />

                    {/* Physical 3D Paper Leaf turning from right to left */}
                    <div
                      className="block absolute top-0 bottom-0 left-1/2 w-1/2 z-30 pointer-events-none transform-style-3d origin-left animate-paper-flip-next"
                      style={{ ...currentPhysics.cssStyle, willChange: 'transform' }}
                    >
                      {/* Front face (Right page side lifting up) */}
                      <div className="absolute inset-0 backface-hidden parchment-texture-right border-l border-[#cfbe9e] shadow-[inset_0_0_50px_rgba(110,80,40,0.3)] flex flex-col justify-between p-2 sm:p-4 overflow-hidden">
                        <div
                          className="absolute inset-0 animate-paper-sheen-next pointer-events-none"
                          style={currentPhysics.cssStyle}
                        />
                        <CornerFiligree position="top-right" className="absolute top-2.5 right-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <CornerFiligree position="bottom-right" className="absolute bottom-2.5 right-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <div className="my-auto mx-auto opacity-15 flex flex-col items-center select-none pointer-events-none">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#7a5833]/60 flex items-center justify-center p-2">
                            <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#573d27] uppercase tracking-[0.2em] text-center">
                              Marhalah 2008
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back face (Left page side landing down onto left spread) */}
                      <div
                        className="absolute inset-0 backface-hidden parchment-texture-left border-r border-[#cfbe9e] shadow-[inset_0_0_50px_rgba(110,80,40,0.3)] flex flex-col justify-between p-2 sm:p-4 overflow-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <div
                          className="absolute inset-0 animate-paper-sheen-prev pointer-events-none"
                          style={currentPhysics.cssStyle}
                        />
                        <CornerFiligree position="top-left" className="absolute top-2.5 left-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <CornerFiligree position="bottom-left" className="absolute bottom-2.5 left-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <div className="my-auto mx-auto opacity-15 flex flex-col items-center select-none pointer-events-none">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#7a5833]/60 flex items-center justify-center p-2">
                            <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#573d27] uppercase tracking-[0.2em] text-center">
                              Forza Youth
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Shadow cast on the left page underneath the lifting sheet */}
                    <div
                      className="block absolute top-0 bottom-0 left-0 w-1/2 pointer-events-none z-20 animate-under-page-shadow-prev"
                      style={currentPhysics.cssStyle}
                    />
                    {/* Soft landing shadow forming on the right page */}
                    <div
                      className="block absolute top-0 bottom-0 right-0 w-1/2 pointer-events-none z-20 animate-landing-shadow-prev"
                      style={currentPhysics.cssStyle}
                    />

                    {/* Physical 3D Paper Leaf turning from left to right */}
                    <div
                      className="block absolute top-0 bottom-0 left-0 w-1/2 z-30 pointer-events-none transform-style-3d origin-right animate-paper-flip-prev"
                      style={{ ...currentPhysics.cssStyle, willChange: 'transform' }}
                    >
                      {/* Front face (Left page side lifting up) */}
                      <div className="absolute inset-0 backface-hidden parchment-texture-left border-r border-[#cfbe9e] shadow-[inset_0_0_50px_rgba(110,80,40,0.3)] flex flex-col justify-between p-2 sm:p-4 overflow-hidden">
                        <div
                          className="absolute inset-0 animate-paper-sheen-prev pointer-events-none"
                          style={currentPhysics.cssStyle}
                        />
                        <CornerFiligree position="top-left" className="absolute top-2.5 left-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <CornerFiligree position="bottom-left" className="absolute bottom-2.5 left-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <div className="my-auto mx-auto opacity-15 flex flex-col items-center select-none pointer-events-none">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#7a5833]/60 flex items-center justify-center p-2">
                            <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#573d27] uppercase tracking-[0.2em] text-center">
                              Forza Youth
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back face (Right page side landing down onto right spread) */}
                      <div
                        className="absolute inset-0 backface-hidden parchment-texture-right border-l border-[#cfbe9e] shadow-[inset_0_0_50px_rgba(110,80,40,0.3)] flex flex-col justify-between p-2 sm:p-4 overflow-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <div
                          className="absolute inset-0 animate-paper-sheen-next pointer-events-none"
                          style={currentPhysics.cssStyle}
                        />
                        <CornerFiligree position="top-right" className="absolute top-2.5 right-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <CornerFiligree position="bottom-right" className="absolute bottom-2.5 right-2.5 w-8 sm:w-12 h-8 sm:h-12 opacity-35 pointer-events-none" gold={false} />
                        <div className="my-auto mx-auto opacity-15 flex flex-col items-center select-none pointer-events-none">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#7a5833]/60 flex items-center justify-center p-2">
                            <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#573d27] uppercase tracking-[0.2em] text-center">
                              Marhalah 2008
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom Integrated Leather Footer: Leaf Markers & Navigation */}
          <div className="relative z-40 w-full pt-1.5 sm:pt-2 pb-0.5 px-2 sm:px-4 flex items-center justify-between text-xs font-cinzel text-[#d4ad63] border-t border-[#522b13]/60 shrink-0">
            {/* Prev Page/Spread Button */}
            <button
              onClick={handlePrev}
              disabled={currentSpread === 0 && (!isMobile || mobilePageSide === 'left')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded border border-[#7a4823] bg-[#220d09] text-[#f7e0b5] text-[11px] sm:text-xs font-cinzel font-semibold transition-all cursor-pointer ${
                currentSpread === 0 && (!isMobile || mobilePageSide === 'left')
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#3d1911] hover:border-[#caa35c]'
              }`}
              title="Halaman / Lembaran Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#caa35c]" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Center: Halaman (Mobile) / Lembaran (Desktop) Indicator & Dot Markers */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <span className="font-source-serif text-[11px] sm:text-xs md:text-sm text-[#caa35c]/95 font-bold">
                {isMobile
                  ? `Halaman ${currentSpread * 2 + (mobilePageSide === 'left' ? 1 : 2)} dari 14`
                  : `Lembaran ${currentSpread + 1} dari ${totalSpreads}`}
              </span>

              {/* Dot leaf markers */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {Array.from({ length: totalSpreads }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSpread(i, 'left')}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSpread === i
                        ? 'w-5 sm:w-7 bg-[#caa35c] shadow-[0_0_8px_rgba(202,163,92,0.6)]'
                        : 'w-2 bg-[#4a2b16] hover:bg-[#804f29]'
                    }`}
                    title={`Buka Lembaran ${i + 1}: ${chapters[i]?.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Next Page / Close to Back Cover Button */}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded border border-[#7a4823] bg-[#220d09] text-[#f7e0b5] text-[11px] sm:text-xs font-cinzel font-semibold transition-all cursor-pointer hover:bg-[#3d1911] hover:border-[#caa35c]"
              title={
                currentSpread === totalSpreads - 1 && (!isMobile || mobilePageSide === 'right')
                  ? 'Halaman 15 Selesai · Tutup ke Sampul Belakang'
                  : 'Berikutnya'
              }
            >
              <span className="hidden sm:inline">
                {currentSpread === totalSpreads - 1 && (!isMobile || mobilePageSide === 'right')
                  ? 'Sampul Belakang'
                  : 'Berikutnya'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#caa35c]" />
            </button>
          </div>
        </div>

        {/* Transparent Discreet Page Turn Buttons - Wide Screens Only */}
        <button
          onClick={handlePrev}
          disabled={currentSpread === 0}
          className={`hidden lg:flex absolute -left-3 xl:-left-5 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 xl:p-3 rounded-full border border-[#caa35c]/25 hover:border-[#caa35c] bg-[#1a0805]/20 hover:bg-[#381a13]/85 text-[#f0d49e]/50 hover:text-[#f0d49e] backdrop-blur-xs shadow-xs hover:shadow-[0_8px_25px_rgba(0,0,0,0.8)] transition-all duration-200 ${
            currentSpread === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-30 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          title="Balik ke Lembaran Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#caa35c]/80 hover:text-[#caa35c]" />
        </button>

        {/* Right Page Turn Button (Next / Close to Back Cover) - Transparent & Unobtrusive */}
        <button
          onClick={handleNext}
          className="hidden lg:flex absolute -right-3 xl:-right-5 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 xl:p-3 rounded-full border border-[#caa35c]/25 hover:border-[#caa35c] bg-[#1a0805]/20 hover:bg-[#381a13]/85 text-[#f0d49e]/50 hover:text-[#f0d49e] opacity-30 hover:opacity-100 backdrop-blur-xs shadow-xs hover:shadow-[0_8px_25px_rgba(0,0,0,0.8)] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title={currentSpread === totalSpreads - 1 ? 'Halaman 15 Selesai · Tutup ke Sampul Belakang' : 'Balik ke Lembaran Berikutnya'}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#caa35c]/80 hover:text-[#caa35c]" />
        </button>
      </div>
    </div>
  );
});
OpenBook.displayName = 'OpenBook';
