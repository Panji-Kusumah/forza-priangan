import React, { memo } from 'react';
import { CornerFiligree, ArchivalStamp, ChapterDivider } from '../Ornaments';
import { LOGO_ELEMENTS } from '../../data/logoMeaning';
import { Sparkles, BookOpen } from 'lucide-react';

interface Spread1StoryPart2Props {
  onNavigateToNextSpread?: () => void;
  onNavigateToPrevSpread?: () => void;
  mobilePageSide?: 'left' | 'right';
}

const PAGE_6_ELEMENTS = LOGO_ELEMENTS.slice(7, 10);
const PAGE_7_ELEMENTS = LOGO_ELEMENTS.slice(10, 13);

export const Spread1StoryPart2 = memo<Spread1StoryPart2Props>(({ mobilePageSide = 'left' }) => {
  const page6Elements = PAGE_6_ELEMENTS;
  const page7Elements = PAGE_7_ELEMENTS;

  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none">
      {/* LEFT PAGE: Halaman 06 - Spiritualitas & Ukhuwah (Elemen 08 s/d 10) */}
      <div
        className={`${
          mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-2 sm:p-3 md:p-5 lg:p-6 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-left" className="absolute top-2 left-2 sm:top-3 sm:left-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        {/* Chapter Header */}
        <div className="shrink-0">
          <div className="text-[8.5px] sm:text-[10px] md:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#b3832c]" />
            <span>Bab Pertama · Spiritualitas & Ukhuwah</span>
          </div>
          <h2 className="font-cinzel text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5">
            Cahaya Iman, Persatuan & Sumber Ilmu
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827]">
            Elemen VIII s/d X · Falsafah Nilai Ruhani & Ikatan Abadi Alumni 2008
          </div>
          <div className="w-full my-1">
            <ChapterDivider arabic="رُوْحَانِيَّةُ الإِسْلَامِ وَوَحْدَةُ الأُخُوَّةِ" />
          </div>
        </div>

        {/* Spiritual Context Banner */}
        <div className="bg-[#f3eadc]/90 border border-[#c5ad8d] rounded-lg p-1.5 sm:p-2 shadow-xs shrink-0 flex items-center gap-2 sm:gap-2.5 my-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#3d2613] text-[#caa35c] flex items-center justify-center shrink-0 border border-[#b88c4b] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#caa35c]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cinzel text-[9.5px] sm:text-[11px] md:text-xs font-bold text-[#2e1a0b] uppercase tracking-wide">
              Landasan Tauhid & Persaudaraan
            </div>
            <p className="font-source-serif text-[8.5px] sm:text-[10px] md:text-[11px] text-[#543b24] leading-snug line-clamp-2">
              Menghubungkan ketundukan spiritual kepada Allah SWT dengan ukhuwah islamiyah yang tak lekang oleh masa.
            </p>
          </div>
        </div>

        {/* 3 Elements Cards for Page 06 */}
        <div className="my-auto py-1 flex flex-col justify-around gap-1.5 sm:gap-2">
          {page6Elements.map((el) => (
            <div
              key={el.id}
              className="p-1.5 sm:p-2 md:p-2.5 rounded-lg border bg-[#fcf7ee]/90 border-[#dacdb6] shadow-xs flex items-start gap-2"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#3c2210] text-[#fbf5e8] flex items-center justify-center font-cinzel font-bold text-[9px] sm:text-[11px] md:text-xs shrink-0 border border-[#c49852] shadow-xs">
                {String(el.id).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h3 className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#2a1708] uppercase tracking-wide">
                    {el.title}
                  </h3>
                  <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-source-serif italic font-semibold px-1 sm:px-1.5 py-0.2 rounded bg-[#ecd8bc] text-[#5e3817] border border-[#d8be99]">
                    {el.category}
                  </span>
                </div>
                <p className="font-source-serif text-[9.5px] sm:text-[11px] md:text-xs lg:text-[13px] text-[#3d2a1a] leading-relaxed mt-0.5 text-justify">
                  {el.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between text-xs shrink-0 mt-1">
          <div className="font-handwritten text-[10px] sm:text-xs md:text-sm text-[#7a481c] truncate">
            *Ukhuwah: &ldquo;Bersatu dalam iman, teguh dalam keilmuan.&rdquo;
          </div>
          <span className="font-source-serif font-bold text-[#825c35] text-[10px] sm:text-xs shrink-0 ml-2">Hal. 06</span>
        </div>
      </div>

      {/* RIGHT PAGE: Halaman 07 - Warna & Tonggak Sejarah (Elemen 11 s/d 13) */}
      <div
        className={`${
          mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full p-2 sm:p-3 md:p-5 lg:p-6 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-right" className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        {/* Header */}
        <div className="shrink-0">
          <div className="text-[8.5px] sm:text-[10px] md:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#b3832c]" />
            <span>Bab Pertama · Warna & Tonggak Sejarah</span>
          </div>
          <h2 className="font-cinzel text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5">
            Warna Fondasi & Jejak Abadi 2008
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827]">
            Elemen XI s/d XIII · Tri-Warna, Kemuliaan Emas & Tonggak Marhalah
          </div>
          <div className="w-full my-1">
            <ChapterDivider arabic="أَلْوَانُ الشِّعَارِ وَتَارِيْخُ المَرْحَلَةِ" />
          </div>
        </div>

        {/* 3 Elements Cards for Page 07 */}
        <div className="my-auto py-1 flex flex-col justify-around gap-1.5 sm:gap-2">
          {page7Elements.map((el) => (
            <div
              key={el.id}
              className="p-1.5 sm:p-2 md:p-2.5 rounded-lg border bg-[#fcf7ee]/90 border-[#dacdb6] shadow-xs flex items-start gap-2"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#3c2210] text-[#fbf5e8] flex items-center justify-center font-cinzel font-bold text-[9px] sm:text-[11px] md:text-xs shrink-0 border border-[#c49852] shadow-xs">
                {String(el.id).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h3 className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#2a1708] uppercase tracking-wide">
                    {el.title}
                  </h3>
                  <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-source-serif italic font-semibold px-1 sm:px-1.5 py-0.2 rounded bg-[#ecd8bc] text-[#5e3817] border border-[#d8be99]">
                    {el.category}
                  </span>
                </div>
                <p className="font-source-serif text-[9.5px] sm:text-[11px] md:text-xs lg:text-[13px] text-[#3d2a1a] leading-relaxed mt-0.5 text-justify">
                  {el.meaning}
                </p>
              </div>
            </div>
          ))}

          {/* Holistic Closing Philosophy Note */}
          <div className="p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-[#caa35c]/70 bg-gradient-to-r from-[#fbf4e8] to-[#f4e7d1] shadow-xs shrink-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-cinzel text-[9px] sm:text-[10px] md:text-xs font-bold text-[#5c3714] uppercase tracking-wider">
                Ikhtisar Khidmat Konsulat Priangan 2008
              </span>
            </div>
            <p className="font-source-serif italic text-[9.5px] sm:text-[11px] md:text-xs text-[#422915] leading-relaxed text-justify">
              &ldquo;Tiga belas elemen lambang ini bukanlah sekadar goresan estetika, melainkan kompas pengingat bahwa ke mana pun para alumni melangkah, ruh Gontor dan keluhuran tatar Pasundan senantiasa menyatu dalam baktinya.&rdquo;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between font-source-serif font-bold text-[#825c35] text-[10px] sm:text-xs shrink-0 mt-1">
          <ArchivalStamp text="FALSAFAH LENGKAP" subtext="FORZA YOUTH 2008" year="1429 H" color="sepia" />
          <span>Hal. 07</span>
        </div>
      </div>
    </div>
  );
});
Spread1StoryPart2.displayName = 'Spread1StoryPart2';
