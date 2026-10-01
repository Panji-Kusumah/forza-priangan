import React, { memo } from 'react';
import { CornerFiligree, ArchivalStamp, ChapterDivider, BookCrest } from '../Ornaments';

interface Spread0CoverProps {
    onNavigate: (spreadIndex: number) => void;
    mobilePageSide?: 'left' | 'right';
}

export const Spread0Cover = memo<Spread0CoverProps>(({ onNavigate, mobilePageSide = 'left' }) => {
    return (
        <div className="w-full h-full flex flex-row overflow-hidden select-none">
            {/* LEFT PAGE: Frontispiece / Halaman Judul & Dedikasi */}
            <div
                className={`${mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
                    } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-2 sm:p-3 md:p-5 lg:p-6 flex-col justify-between relative overflow-y-auto book-scroll`}
            >
                <CornerFiligree position="top-left" className="absolute top-2 left-2 sm:top-3 sm:left-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />
                <CornerFiligree position="bottom-left" className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

                {/* Top Header */}
                <div className="text-center pt-0.5 shrink-0">
                    <div className="font-arabic text-base sm:text-xl md:text-2xl lg:text-3xl text-[#3d2612] font-bold">
                        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-[0.2em] text-[#7a5833] uppercase font-bold">
                        Kulliyatu-l-Mu&apos;allimin Al-Islamiyyah
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-source-serif italic text-[#8c6b45]">
                        Pondok Modern Darussalam Gontor Ponorogo
                    </div>
                </div>

                {/* Centerpiece Bookplate */}
                <div className="py-1 my-auto flex flex-col justify-center items-center text-center px-1 sm:px-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 mb-1 opacity-95 shrink-0">
                        <BookCrest className="w-full h-full" />
                    </div>

                    {/* Level 1: Background Gontor Institution */}
                    <div className="font-cinzel text-[8.5px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#7a5833] uppercase">
                        Pondok Modern Darussalam Gontor
                    </div>

                    {/* Level 2: Alumni Konsulat Priangan */}
                    <div className="font-cinzel text-[10px] sm:text-xs md:text-sm lg:text-base font-bold tracking-[0.16em] text-[#4d321b] uppercase mt-0.5">
                        Alumni — Konsulat Priangan
                    </div>

                    {/* Level 3: Youth Generation */}
                    <div className="text-[8px] sm:text-[9px] md:text-xs font-cinzel tracking-[0.2em] text-[#7a5833] uppercase font-semibold">
                        Youth Generation
                    </div>

                    <div className="w-full max-w-xs sm:max-w-md my-0.5 shrink-0">
                        <ChapterDivider />
                    </div>

                    {/* Level 4: Marhalah 2008 */}
                    <h1 className="font-cinzel text-base sm:text-xl md:text-2xl lg:text-[34px] font-black tracking-[0.14em] text-[#331c0a] uppercase drop-shadow-xs leading-tight">
                        MARHALAH 2008
                    </h1>

                    {/* Level 5: Forza Youth Generation */}
                    <div className="font-cinzel-decorative text-xs sm:text-base md:text-lg lg:text-xl font-bold tracking-widest text-[#694218]">
                        FORZA YOUTH GENERATION
                    </div>

                    {/* Dedication Text */}
                    <div className="max-w-md mx-auto text-[9.5px] sm:text-[11px] md:text-xs lg:text-sm font-source-serif leading-relaxed text-[#4a3420] italic mt-1 px-1">
                        &ldquo;Dipersembahkan dengan takzim kepada Trimurti Pendiri Pondok Modern Darussalam Gontor, para Masyayikh, segenap Asatidz, serta seluruh ikhwah alumni Gontor asal tatar Priangan (Forza Youth Generation 2008).&rdquo;
                    </div>

                    {/* Sacred Mottoes (Panca Jiwa) */}
                    <div className="mt-1.5 pt-1 border-t border-[#d8c7a6]/70 w-full max-w-sm text-center shrink-0">
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#754f24] font-bold mb-0.5">
                            Panca Jiwa Pondok Modern
                        </div>
                        <div className="text-[9.5px] sm:text-xs font-source-serif text-[#543b24] space-x-1 sm:space-x-1.5 font-medium flex flex-wrap justify-center">
                            <span>Keikhlasan</span>
                            <span>·</span>
                            <span>Kesederhanaan</span>
                            <span>·</span>
                            <span>Berdikari</span>
                            <span>·</span>
                            <span>Ukhuwah</span>
                            <span>·</span>
                            <span>Bebas</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Archival Seal */}
                <div className="flex items-center justify-between pt-1 border-t border-[#d8c7a6]/60 text-[9px] sm:text-[10px] md:text-xs font-cinzel text-[#82613d] shrink-0">
                    <ArchivalStamp text="LEMBARAN RESMI" subtext="KONSULAT PRIANGAN 2008" year="2008" />
                    <div className="text-right">
                        <div className="font-medium">Terbitan: Mei 2008</div>
                        <div className="font-arabic text-xs sm:text-sm md:text-base text-[#52371c] font-bold">١٤٢٩ هـ - ١٤٤٧ هـ</div>
                    </div>
                </div>
            </div>

            {/* RIGHT PAGE: Table of Contents / Fihris */}
            <div
                className={`${mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
                    } w-full md:w-1/2 h-full p-2 sm:p-3 md:p-5 lg:p-6 flex-col justify-between relative overflow-y-auto book-scroll`}
            >
                <CornerFiligree position="top-right" className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />
                <CornerFiligree position="bottom-right" className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

                {/* Header */}
                <div className="text-center pt-0.5 shrink-0">
                    <div className="font-arabic text-lg sm:text-xl md:text-2xl text-[#52371c] font-bold">فِهْرِسُ الكِتَاب</div>
                    <h2 className="font-cinzel text-sm sm:text-lg md:text-2xl lg:text-3xl font-black tracking-[0.12em] text-[#331c0a] uppercase mt-0.5">
                        DAFTAR BAB KENANGAN
                    </h2>
                    <div className="text-[9.5px] sm:text-[11px] md:text-xs font-source-serif italic text-[#755535]">
                        Kisah, arsip sahabat alumni, dan potret abadi Konsulat Priangan 2008
                    </div>
                    <div className="w-full max-w-xs sm:max-w-md mx-auto my-0.5">
                        <ChapterDivider />
                    </div>
                </div>

                {/* Chapter Table with Dotted Leaders */}
                <div className="py-1 my-auto flex flex-col justify-around gap-1 sm:gap-1.5 px-0.5 sm:px-2">
                    {[
                        {
                            index: 1,
                            title: 'Bab I (Bag. 1): Falsafah Lambang (Elemen 01 s/d 07)',
                            subtitle: 'Ruh Islam, Gontor, Kujang, Maung, Galuh, Gunung & Ornamen Sunda',
                            page: 'Hal. 04',
                        },
                        {
                            index: 2,
                            title: 'Bab I (Bag. 2): Falsafah Lambang (Elemen 08 s/d 13)',
                            subtitle: 'Bulan Sabit, Ukhuwah, Kitab Ilmu, Tri-Warna & Tonggak 2008',
                            page: 'Hal. 06',
                        },
                        {
                            index: 3,
                            title: 'Bab II: Sijillul Asma\' (Sahabat Alumni Priangan 2008)',
                            subtitle: 'Daftar Nama Sahabat, Laqob, Asrama, Profesi & Kalam Kenangan',
                            page: 'Hal. 08',
                        },
                        {
                            index: 4,
                            title: 'Bab III: Album Kenangan & Potret Fisik',
                            subtitle: 'Mudik Kahuripan, Liwetan Asrama, PG 2007 & Reuni',
                            page: 'Hal. 10',
                        },
                        {
                            index: 5,
                            title: 'Bab IV: Coretan Tepi & Tanda Tangan Ikhwah',
                            subtitle: 'Pesan Tinta Tangan & Doa Persaudaraan Abadi',
                            page: 'Hal. 12',
                        },
                        {
                            index: 6,
                            title: 'Bab V: Tinta Baru (Sumbang Kenangan)',
                            subtitle: 'Tambahkan Profilmu atau Tempelkan Foto Kenangan Priangan',
                            page: 'Hal. 14',
                        },
                    ].map((ch) => (
                        <button
                            key={ch.index}
                            onClick={() => onNavigate(ch.index)}
                            className="group w-full text-left flex flex-col p-1 sm:p-2 rounded-lg hover:bg-[#ede1c7]/80 transition-colors border-b border-[#dfd0b5]/70 focus:outline-none cursor-pointer"
                        >
                            <div className="flex items-baseline justify-between w-full">
                                <span className="font-cinzel text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-[#3d2714] group-hover:text-[#804c1e] transition-colors leading-tight truncate">
                                    {ch.title}
                                </span>
                                <span className="font-source-serif text-[10px] sm:text-xs font-bold text-[#805a33] tabular-nums shrink-0 ml-1.5">
                                    {ch.page}
                                </span>
                            </div>
                            <span className="text-[8.5px] sm:text-[10px] md:text-xs font-source-serif italic text-[#634830] group-hover:text-[#3d2714] mt-0.5 truncate">
                                {ch.subtitle}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="pt-1 border-t border-[#d8c7a6]/60 text-center shrink-0">
                    <p className="font-handwritten text-xs sm:text-sm md:text-base text-[#613f1f] leading-tight">
                        &ldquo;Barangsiapa melupakan sejarahnya, bagai pohon yang kehilangan akarnya.&rdquo;
                    </p>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] font-cinzel tracking-wider text-[#82613d] uppercase mt-0.5 font-bold">
                        Gontor Alumni · Konsulat Priangan · Forza Youth Generation 2008
                    </div>
                </div>
            </div>
        </div>
    );
});
Spread0Cover.displayName = 'Spread0Cover';
