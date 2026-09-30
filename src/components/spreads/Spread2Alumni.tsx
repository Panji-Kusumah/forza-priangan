import React, { useState, memo, useMemo } from 'react';
import { Alumnus } from '../../types';
import { PhotoCorners } from '../Ornaments';
import { PRIANGAN_REGIONS } from '../../data/mockData';
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight, Home, UserPlus } from 'lucide-react';

interface Spread2AlumniProps {
  alumniList: Alumnus[];
  onSelectAlumnus: (alumnus: Alumnus) => void;
  onNavigateToContribute?: () => void;
  mobilePageSide?: 'left' | 'right';
}

export const Spread2Alumni = memo<Spread2AlumniProps>(({
  alumniList,
  onSelectAlumnus,
  onNavigateToContribute,
  mobilePageSide = 'left',
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua Wilayah Priangan');
  const [alumniPageIndex, setAlumniPageIndex] = useState(0);

  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.kunya.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      (a.prianganRegion && a.prianganRegion.toLowerCase().includes(search.toLowerCase())) ||
      (a.rayonGontor && a.rayonGontor.toLowerCase().includes(search.toLowerCase())) ||
      a.occupation.toLowerCase().includes(search.toLowerCase());
    const matchesRegion =
      selectedRegion === 'Semua Wilayah Priangan' ||
      a.prianganRegion === selectedRegion ||
      a.city.includes(selectedRegion.replace(' Raya', ''));
    return matchesSearch && matchesRegion;
  });

  // Urutan otomatis berdasarkan abjad huruf nama lengkap (A–Z)
  const sortedAlumni = [...filteredAlumni].sort((a, b) =>
    a.fullName.trim().localeCompare(b.fullName.trim(), 'id', { sensitivity: 'base' })
  );

  // 4 alumni per two-page spread (2 left, 2 right) on both mobile and desktop
  const itemsPerPage = 4;
  const totalAlumniPages = Math.max(1, Math.ceil(sortedAlumni.length / itemsPerPage));
  const safePageIndex = Math.min(alumniPageIndex, totalAlumniPages - 1);

  const currentBatch = sortedAlumni.slice(
    safePageIndex * itemsPerPage,
    safePageIndex * itemsPerPage + itemsPerPage
  );

  const leftPageAlumni = currentBatch.slice(0, 2);
  const rightPageAlumni = currentBatch.slice(2, 4);

  const handleNextLeaf = () => {
    if (safePageIndex < totalAlumniPages - 1) {
      setAlumniPageIndex(safePageIndex + 1);
    }
  };

  const handlePrevLeaf = () => {
    if (safePageIndex > 0) {
      setAlumniPageIndex(safePageIndex - 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* Antique Header & Parchment Search Control */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 pt-1.5 sm:pt-2.5 pb-1.5 border-b border-[#cfbe9e]/60 flex flex-wrap items-center justify-between gap-1.5 bg-[#f8f1df]/40 shrink-0">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-xs md:text-sm font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold truncate">
            Bab Kedua · Sijillul Asma&apos; Alumni
          </div>
          <h2 className="font-cinzel text-xs sm:text-lg md:text-xl lg:text-2xl font-black tracking-[0.1em] text-[#331c0a] uppercase leading-tight truncate">
            Sahabat Konsulat Priangan · 2008
          </h2>
          <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
            <span className="font-source-serif italic text-[9.5px] sm:text-xs text-[#6b4c2b]">
              {sortedAlumni.length} Sahabat (A–Z)
            </span>
            <span className="hidden sm:inline-block text-[9px] font-cinzel tracking-wider px-1.5 py-0.2 rounded-full bg-[#f4e6ce] border border-[#bfa683] text-[#78532c] font-semibold">
              Terbuka untuk Dilengkapi
            </span>
          </div>
        </div>

        {/* Search, Region Filter & Add Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Search box styled as ink-on-parchment */}
          <div className="relative w-28 sm:w-40 md:w-48">
            <input
              type="text"
              placeholder="Cari sahabat..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setAlumniPageIndex(0);
              }}
              className="w-full pl-6 pr-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] placeholder-[#8d755c] focus:outline-none focus:border-[#7d512a]"
            />
            <Search className="w-3 h-3 text-[#8d755c] absolute left-1.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Priangan Region Selector */}
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setAlumniPageIndex(0);
            }}
            className="text-[9.5px] sm:text-xs font-cinzel py-0.5 px-1 sm:px-1.5 bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a] font-semibold cursor-pointer shrink-0 max-w-[95px] sm:max-w-none truncate"
          >
            {PRIANGAN_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          {/* Quick Action: Tambah Nama bagi yang belum terdaftar */}
          {onNavigateToContribute && (
            <button
              onClick={onNavigateToContribute}
              className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 bg-[#4a2e18] hover:bg-[#331c0a] text-[#f7eedd] text-[9.5px] sm:text-xs font-cinzel font-bold tracking-wider rounded border border-[#caa35c] shadow-xs cursor-pointer shrink-0 transition-colors"
              title="Nama belum terdaftar? Klik untuk mengisi dan menambahkan ke buku"
            >
              <UserPlus className="w-3 h-3 text-[#e5c278]" />
              <span className="hidden md:inline">+ Tambah Nama</span>
              <span className="md:hidden">+ Nama</span>
            </button>
          )}
        </div>
      </div>

      {/* Pages Container: Left Page and Right Page (1 page on mobile, 2 pages on desktop) */}
      <div className="flex-1 flex flex-row overflow-hidden w-full h-full">
        {/* LEFT PAGE */}
        <div
          className={`${
            mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
          } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between overflow-y-auto book-scroll`}
        >
          <div className="space-y-1.5 sm:space-y-2.5 py-1 my-auto flex-1 flex flex-col justify-around">
            {leftPageAlumni.length === 0 ? (
              <div className="py-6 text-center text-xs font-source-serif italic text-[#78593a] flex flex-col items-center gap-1.5">
                <div>Nama sahabat belum terdaftar atau tidak ditemukan dalam pencarian.</div>
                {onNavigateToContribute && (
                  <button
                    onClick={onNavigateToContribute}
                    className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 bg-[#4a2e18] hover:bg-[#331c0a] text-[#f7eedd] text-[10px] sm:text-xs font-cinzel font-bold tracking-wider rounded border border-[#caa35c] shadow-xs cursor-pointer transition-colors"
                  >
                    <UserPlus className="w-3 h-3 text-[#e5c278]" />
                    <span>Daftarkan Sahabat</span>
                  </button>
                )}
              </div>
            ) : (
              leftPageAlumni.map((alumnus) => (
                <AlumnusCard
                  key={alumnus.id}
                  alumnus={alumnus}
                  onClick={() => onSelectAlumnus(alumnus)}
                />
              ))
            )}
          </div>

          {/* Left Page Footer */}
          <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-1">
            <span className="font-cinzel text-[9.5px] sm:text-xs uppercase tracking-wider text-[#8a6845] truncate">
              Marhalah 2008 · Forza Youth
            </span>
            <span className="shrink-0 ml-1">Hal. {String(8 + safePageIndex * 2).padStart(2, '0')}</span>
          </div>
        </div>

        {/* RIGHT PAGE */}
        <div
          className={`${
            mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
          } w-full md:w-1/2 h-full p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between overflow-y-auto book-scroll`}
        >
          <div className="space-y-1.5 sm:space-y-2.5 py-1 my-auto flex-1 flex flex-col justify-around">
            {rightPageAlumni.length === 0 && leftPageAlumni.length > 0 ? (
              <div className="py-8 text-center text-xs font-source-serif italic text-[#78593a]">
                Lembaran kanan buku siap untuk nama berikutnya.
              </div>
            ) : (
              rightPageAlumni.map((alumnus) => (
                <AlumnusCard
                  key={alumnus.id}
                  alumnus={alumnus}
                  onClick={() => onSelectAlumnus(alumnus)}
                />
              ))
            )}
          </div>

          {/* Right Page Footer with Leaf Navigation */}
          <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={handlePrevLeaf}
                disabled={safePageIndex === 0}
                className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded border border-[#bfa683] text-[9.5px] sm:text-xs font-cinzel transition-all ${
                  safePageIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'bg-[#ede1c7] hover:bg-[#dfd0b5] text-[#422610] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <span className="font-source-serif text-[9.5px] sm:text-xs text-[#6e4e2a] px-0.5 font-semibold">
                Lembar {safePageIndex + 1}/{totalAlumniPages}
              </span>

              <button
                onClick={handleNextLeaf}
                disabled={safePageIndex >= totalAlumniPages - 1}
                className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded border border-[#bfa683] text-[9.5px] sm:text-xs font-cinzel transition-all ${
                  safePageIndex >= totalAlumniPages - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'bg-[#ede1c7] hover:bg-[#dfd0b5] text-[#422610] cursor-pointer'
                }`}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <span className="shrink-0 ml-1">Hal. {String(9 + safePageIndex * 2).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
Spread2Alumni.displayName = 'Spread2Alumni';

const AlumnusCard = memo<{
  alumnus: Alumnus;
  onClick: () => void;
}>(({ alumnus, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative p-1.5 sm:p-2.5 rounded-lg border border-[#dacdb6] hover:border-[#966b3b] bg-[#faf4e6]/90 hover:bg-[#f6ebd5] transition-all cursor-pointer shadow-xs hover:shadow-sm"
    >
      <div className="flex gap-1.5 sm:gap-2.5 items-start">
        {/* Vintage Photograph Frame */}
        <div className="relative w-10 h-14 sm:w-16 sm:h-22 md:w-20 md:h-26 shrink-0 bg-[#e7d8bf] border border-[#a4845e] p-0.5 sm:p-1 shadow-xs">
          <PhotoCorners />
          <img
            src={alumnus.photoUrl}
            alt={alumnus.fullName}
            className="w-full h-full object-cover grayscale contrast-115 sepia-[0.35] group-hover:sepia-0 group-hover:grayscale-0 transition-all duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content with no cutting-off */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-0.5">
            <h3 className="font-cinzel text-[11px] sm:text-sm md:text-base font-bold text-[#2d1b0d] group-hover:text-[#7d481b] transition-colors leading-tight truncate">
              {alumnus.fullName}
            </h3>
            <span className="font-source-serif text-[9px] sm:text-xs font-bold text-[#7d5d3e] shrink-0">
              {alumnus.stambuk}
            </span>
          </div>

          <div className="font-handwritten text-[11px] sm:text-sm md:text-base text-[#824c1e] font-bold mt-0.2 truncate">
            {alumnus.kunya} · {alumnus.prianganRegion || alumnus.city}
          </div>

          <div className="mt-0.5 flex flex-col gap-0.5 text-[9.5px] sm:text-[11px] md:text-xs font-source-serif text-[#4e3927]">
            <div className="flex items-center gap-1 truncate">
              <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#946738] shrink-0" />
              <span className="truncate">{alumnus.occupation}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#946738] shrink-0" />
              <span className="truncate">{alumnus.city}</span>
            </div>
            {alumnus.rayonGontor && (
              <div className="flex items-center gap-1 text-[8.5px] sm:text-[10px] text-[#7a5833] italic truncate">
                <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#946738] shrink-0" />
                <span className="truncate">Asrama: {alumnus.rayonGontor}</span>
              </div>
            )}
          </div>

          {/* Kalam Kenangan Snippet */}
          <p className="mt-1 text-[9px] sm:text-[11px] md:text-xs font-source-serif italic text-[#593c20] leading-snug border-l-2 border-[#946738]/60 pl-1 line-clamp-2">
            &ldquo;{alumnus.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
});
AlumnusCard.displayName = 'AlumnusCard';
