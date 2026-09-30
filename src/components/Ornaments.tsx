import React, { memo } from 'react';

export const CornerFiligree = memo<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  gold?: boolean;
}>(({ className = 'w-16 h-16', position = 'top-left', gold = true }) => {
  const rotation =
    position === 'top-right'
      ? 'rotate-90'
      : position === 'bottom-right'
      ? 'rotate-180'
      : position === 'bottom-left'
      ? '-rotate-90'
      : '';

  const strokeColor = gold ? '#c99e52' : '#573d27';
  const fillColor = gold ? '#9e7534' : '#3d2816';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${rotation} pointer-events-none transform transition-transform`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer corner frame */}
      <path
        d="M5 95V25C5 13.9543 13.9543 5 25 5H95"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M12 95V28C12 19.1634 19.1634 12 28 12H95"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="3 3"
        strokeOpacity="0.8"
      />
      {/* Ornate flourishes */}
      <path
        d="M20 75C20 45 45 20 75 20"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle cx="25" cy="25" r="5" fill={fillColor} />
      <path
        d="M25 25C25 35 35 45 45 45C35 45 25 55 25 65C25 55 15 45 5 45C15 45 25 35 25 25Z"
        fill={strokeColor}
        fillOpacity="0.8"
      />
      <circle cx="55" cy="22" r="3" fill={strokeColor} />
      <circle cx="22" cy="55" r="3" fill={strokeColor} />
    </svg>
  );
});
CornerFiligree.displayName = 'CornerFiligree';

export const BookCrest = memo<{ className?: string }>(({ className = 'w-36 h-36 sm:w-44 sm:h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img
        src="/logokonsul.png"
        alt="Logo Konsulat Priangan"
        className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]"
        loading="eager"
      />
    </div>
  );
});
BookCrest.displayName = 'BookCrest';

export const ArchivalStamp = memo<{
  text?: string;
  subtext?: string;
  year?: string;
  className?: string;
  color?: 'red' | 'navy' | 'sepia';
}>(({
  text = 'ARSIP RESMI KONSULAT',
  subtext = 'PRIANGAN · GONTOR 2008',
  year = '2008',
  className = '',
  color = 'red',
}) => {
  const colorMap = {
    red: 'border-red-900/60 text-red-950/70',
    navy: 'border-indigo-950/60 text-indigo-950/70',
    sepia: 'border-[#5a3a1f]/60 text-[#5a3a1f]/75',
  };

  return (
    <div
      className={`inline-block border-2 border-dashed px-3 py-1.5 text-center font-cinzel tracking-widest uppercase select-none transform rotate-[-3.5deg] opacity-75 mix-blend-multiply ${colorMap[color]} ${className}`}
    >
      <div className="text-[9px] font-bold tracking-[0.25em]">{text}</div>
      <div className="text-[7.5px] tracking-wider opacity-85">{subtext}</div>
      <div className="text-[10px] font-black tracking-[0.3em] mt-0.5">{year}</div>
    </div>
  );
});
ArchivalStamp.displayName = 'ArchivalStamp';

export const PhotoCorners = memo<{ className?: string }>(({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-[#362112]/70 shadow-sm" />
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-[#362112]/70 shadow-sm" />
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-[#362112]/70 shadow-sm" />
      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-[#362112]/70 shadow-sm" />
    </div>
  );
});
PhotoCorners.displayName = 'PhotoCorners';

export const VintageWashiTape = memo<{
  className?: string;
  position?: 'top' | 'top-right' | 'top-left' | 'corner';
}>(({ className = 'w-24 h-6', position = 'top' }) => {
  const posClasses =
    position === 'top'
      ? '-top-3 left-1/2 -translate-x-1/2 rotate-[-1deg]'
      : position === 'top-right'
      ? '-top-2 -right-3 rotate-[22deg]'
      : position === 'top-left'
      ? '-top-2 -left-3 rotate-[-22deg]'
      : '';

  return (
    <div
      className={`absolute ${posClasses} ${className} vintage-tape z-20 opacity-85 pointer-events-none`}
    />
  );
});
VintageWashiTape.displayName = 'VintageWashiTape';

export const ChapterDivider = memo<{ title?: string; arabic?: string }>(({
  title,
  arabic,
}) => {
  return (
    <div className="my-4 flex items-center justify-center gap-3 text-[#7a552e]">
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#9c753b] to-[#9c753b]" />
      <span className="text-xs">✦</span>
      {arabic && (
        <span className="font-arabic text-sm text-[#543315] font-bold px-1">
          {arabic}
        </span>
      )}
      {title && (
        <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-semibold text-[#543315]">
          {title}
        </span>
      )}
      <span className="text-xs">✦</span>
      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#9c753b] to-[#9c753b]" />
    </div>
  );
});
ChapterDivider.displayName = 'ChapterDivider';
