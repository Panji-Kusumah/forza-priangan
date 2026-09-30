import React, { memo } from 'react';
import { CornerFiligree, ArchivalStamp, ChapterDivider } from '../Ornaments';
import { LOGO_ELEMENTS } from '../../data/logoMeaning';
import { Sparkles } from 'lucide-react';

interface Spread1StoryProps {
  mobilePageSide?: 'left' | 'right';
}

// Static slices extracted to eliminate allocation on re-render
const PAGE_4_ELEMENTS = LOGO_ELEMENTS.slice(0, 3);
const PAGE_5_ELEMENTS = LOGO_ELEMENTS.slice(3, 7);

export const Spread1Story = memo<Spread1StoryProps>(({ mobilePageSide = 'left' }) => {
  const page4Elements = PAGE_4_ELEMENTS;
  const page5Elements = PAGE_5_ELEMENTS;

  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none">
      {/* LEFT PAGE: Halaman 04 - Falsafah & Arti Lambang (Elemen 01 - 03) */}
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
            <span>Bab Pertama · Falsafah Lambang</span>
          </div>
          <h2 className="font-cinzel text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5">
            Arti & Makna Lambang Konsulat Priangan
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827]">
            Elemen I s/d III · Ruh Keislaman, Pesantren & Jati Diri Pasundan
          </div>
          <div className="w-full my-1">
            <ChapterDivider arabic="فَلْسَفَةُ شِعَارِ أَبْنَاءِ فِرِيَانْجَانْ" />
          </div>
        </div>

        {/* Antique Logo Hero Header Box */}
        <div className="bg-[#f4ebe0]/90 border border-[#c5ad8d] rounded-lg p-1.5 sm:p-2 shadow-xs shrink-0 flex items-center gap-2 sm:gap-2.5 my-1">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 bg-[#ecd8bc] rounded-md p-1 border border-[#a47b4d] shadow-inner flex items-center justify-center">
            <img
              src="/logokonsul.png"
              alt="Logo Konsulat Priangan"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#2e1a0b] uppercase tracking-wide truncate">
              Lambang Resmi Konsulat Priangan
            </div>
            <p className="font-source-serif text-[9px] sm:text-[11px] md:text-xs text-[#543b24] leading-snug line-clamp-2">
              Memadukan ruh keislaman, tradisi pesantren Darussalam Gontor, keluhuran Sunda, dan ikatan marhalah 2008.
            </p>
          </div>
        </div>

        {/* 3 Elements Cards for Page 04 */}
        <div className="my-auto py-1 flex flex-col justify-around gap-1.5 sm:gap-2">
          {page4Elements.map((el) => (
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
            *Falsafah: &ldquo;Di Darussalam kami ditempa, di tatar Pasundan kami mengabdi.&rdquo;
          </div>
          <span className="font-source-serif font-bold text-[#825c35] text-[10px] sm:text-xs shrink-0 ml-2">Hal. 04</span>
        </div>
      </div>

      {/* RIGHT PAGE: Halaman 05 - Warisan, Karakter & Alam (Elemen 04 s/d 07) */}
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
            <span>Bab Pertama · Warisan & Karakter</span>
          </div>
          <h2 className="font-cinzel text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5">
            Keluhuran Tradisi & Tanah Priangan
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827]">
            Elemen IV s/d VII · Karakter Maung, Sejarah Kerajaan & Alam Pasundan
          </div>
          <div className="w-full my-1">
            <ChapterDivider arabic="أَصَالَةُ التَّرَاثِ وَطَبِيْعَةُ فِرِيَانْجَانْ" />
          </div>
        </div>

        {/* 4 Elements Cards for Page 05 */}
        <div className="my-auto py-1 flex flex-col justify-around gap-1 sm:gap-1.5 md:gap-2">
          {page5Elements.map((el) => (
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

        {/* Footer */}
        <div className="pt-1.5 border-t border-[#d8c7a6]/60 flex items-center justify-between font-source-serif font-bold text-[#825c35] text-[10px] sm:text-xs shrink-0 mt-1">
          <ArchivalStamp text="FALSAFAH LOGO" subtext="FORZA YOUTH 2008" year="1429 H" color="sepia" />
          <span>Hal. 05</span>
        </div>
      </div>
    </div>
  );
});
Spread1Story.displayName = 'Spread1Story';
