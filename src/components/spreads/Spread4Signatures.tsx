import React, { useState, memo } from 'react';
import { CornerFiligree, ChapterDivider } from '../Ornaments';
import { SignatureEntry } from '../../types';
import { Feather, ChevronLeft, ChevronRight } from 'lucide-react';

interface Spread4SignaturesProps {
  signatures: SignatureEntry[];
  onAddSignature: (entry: Omit<SignatureEntry, 'id' | 'date'>) => Promise<void>;
  mobilePageSide?: 'left' | 'right';
}

export const Spread4Signatures = memo<Spread4SignaturesProps>(({
  signatures,
  onAddSignature,
  mobilePageSide = 'left',
}) => {
  // Form State
  const [name, setName] = useState('');
  const [kunya, setKunya] = useState('');
  const [consulat, setConsulat] = useState('');
  const [message, setMessage] = useState('');
  const [inkColor, setInkColor] = useState<SignatureEntry['inkColor']>('sepia');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Four inscriptions per physical page reduce unused parchment space.
  const [sigPageIndex, setSigPageIndex] = useState(0);
  const sigsPerPage = 4;
  const totalSigPages = Math.max(1, Math.ceil(signatures.length / sigsPerPage));
  const safeSigIndex = Math.min(sigPageIndex, totalSigPages - 1);
  const currentSignatures = signatures.slice(
    safeSigIndex * sigsPerPage,
    safeSigIndex * sigsPerPage + sigsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAddSignature({
        name: name.trim(),
        kunya: kunya.trim() || 'Sahabat 2008',
        consulat: consulat.trim() || 'Priangan',
        message: message.trim(),
        inkColor,
        handStyle: 'cursive',
        rotation: (Math.random() - 0.5) * 2,
      });

      setName('');
      setKunya('');
      setConsulat('');
      setMessage('');
      setSigPageIndex(0);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Tanda tangan gagal disimpan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inkStyles: Record<SignatureEntry['inkColor'], string> = {
    sepia: 'text-[#5c3716] border-[#8c592b]/40',
    indigo: 'text-[#183153] border-[#294a7a]/40',
    black: 'text-[#241a15] border-[#473429]/40',
    burgundy: 'text-[#691823] border-[#8a2a37]/40',
  };

  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none">
      {/* LEFT PAGE: Inscriptions & Margin Notes */}
      <div
        className={`${
          mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-left" className="absolute top-2 left-2 sm:top-3 sm:left-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        <div className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-[9px] sm:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold truncate">
              Bab Keempat · Catatan Tepi
            </div>

            {/* Leaf navigator for signatures */}
            {totalSigPages > 1 && (
              <div className="flex items-center gap-1 bg-[#ecd9bd] px-1 py-0.2 rounded border border-[#c4a984] text-[9.5px] sm:text-xs font-cinzel font-bold text-[#5c3c1e] shrink-0">
                <button
                  onClick={() => setSigPageIndex((p) => Math.max(0, p - 1))}
                  disabled={safeSigIndex === 0}
                  className="disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span>{safeSigIndex + 1}/{totalSigPages}</span>
                <button
                  onClick={() => setSigPageIndex((p) => Math.min(totalSigPages - 1, p + 1))}
                  disabled={safeSigIndex >= totalSigPages - 1}
                  className="disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <h2 className="font-cinzel text-xs sm:text-lg md:text-xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5 truncate">
            Coretan Tangan & Tanda Tangan
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827] truncate">
            Akun bersama angkatan · nama di bawah adalah atribusi tampilan
          </div>
          <div className="w-full my-0.5">
            <ChapterDivider arabic="تَوْقِيْعَاتُ الأَحِبَّة" />
          </div>
        </div>

        {/* Inscriptions Feed (Paginated: four per leaf) */}
        <div className="flex flex-1 min-h-0 flex-col justify-evenly gap-1.5 overflow-y-auto book-scroll py-1">
          {currentSignatures.length === 0 ? (
            <div className="text-center py-6 text-xs sm:text-sm font-source-serif italic text-[#78593a]">
              Belum ada tanda tangan pada lembaran ini.
            </div>
          ) : (
            currentSignatures.map((sig) => (
              <div
                key={sig.id}
                style={{
                  transform: `rotate(${sig.rotation}deg)`,
                }}
                className={`shrink-0 p-1 sm:p-1.5 md:p-2 rounded-lg border-b-2 border-dashed bg-[#faf3e3]/90 transition-all shadow-xs ${
                  inkStyles[sig.inkColor] || inkStyles.sepia
                }`}
              >
                <p className="font-handwritten text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug wrap-break-word line-clamp-3 md:line-clamp-2">
                  &ldquo;{sig.message}&rdquo;
                </p>

                <div className="mt-0.5 pt-0.5 border-t border-[#dfd0b5]/50 flex flex-wrap items-baseline justify-between gap-0.5 text-[9px] sm:text-[10px] md:text-[11px]">
                  <span className="font-cinzel font-bold tracking-wider truncate">
                    — {sig.name}{' '}
                    <span className="font-handwritten text-[10px] sm:text-xs font-bold opacity-90">
                      ({sig.kunya}, {sig.consulat})
                    </span>
                  </span>
                  <span className="font-source-serif text-[9px] opacity-75 font-medium shrink-0 ml-1">{sig.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Left Footer */}
        <div className="pt-1 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-0.5">
          <span className="font-handwritten text-[10.5px] sm:text-xs text-[#704a25] truncate">
            *Tinta ukhuwah tidak akan pudar
          </span>
          <span className="shrink-0 ml-1">Hal. 12</span>
        </div>
      </div>

      {/* RIGHT PAGE: Ink Well & Quill Form to Sign */}
      <div
        className={`${
          mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-right" className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        <div className="shrink-0">
          <div className="text-[9px] sm:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold truncate">
            Goreskan Pena
          </div>
          <h2 className="font-cinzel text-xs sm:text-lg md:text-xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5 truncate">
            Tinggalkan Jejak Tinta di Sini
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827] truncate">
            Tuliskan pesan, doa, atau kenangan untuk ikhwah Priangan
          </div>
          <div className="w-full my-0.5">
            <ChapterDivider arabic="دَوِّنْ أَثَرَك" />
          </div>
        </div>

        {/* Ink Scribe Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col justify-evenly gap-2 px-0.5 py-2 overflow-y-auto book-scroll">
          <p className="font-source-serif text-[10px] sm:text-xs italic text-[#785b3e]">
            Nama di sini hanya atribusi tampilan; akun bersama tidak mengidentifikasi penulis.
          </p>
          <div>
            <label className="block text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-wider text-[#694827] uppercase mb-0.5 font-bold">
              Nama untuk ditampilkan
            </label>
            <input
              type="text"
              required
              placeholder="Nama tampilan, bukan identitas akun"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
            <div>
              <label className="block text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-wider text-[#694827] uppercase mb-0.5 font-bold">
                Laqob / Panggilan
              </label>
              <input
                type="text"
                placeholder="Panggilan akrab"
                value={kunya}
                onChange={(e) => setKunya(e.target.value)}
                className="w-full px-2 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
              />
            </div>

            <div>
              <label className="block text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-wider text-[#694827] uppercase mb-0.5 font-bold">
                Wilayah Priangan
              </label>
              <input
                type="text"
                placeholder="Bandung / Garut / Tasik / dll"
                value={consulat}
                onChange={(e) => setConsulat(e.target.value)}
                className="w-full px-2 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-wider text-[#694827] uppercase mb-0.5 font-bold">
              Warna Tinta Pena
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              {[
                { id: 'sepia', label: 'Sepia', color: '#5c3716' },
                { id: 'indigo', label: 'Nila', color: '#183153' },
                { id: 'black', label: 'Hitam', color: '#241a15' },
                { id: 'burgundy', label: 'Marun', color: '#691823' },
              ].map((ink) => (
                <button
                  key={ink.id}
                  type="button"
                  onClick={() => setInkColor(ink.id as SignatureEntry['inkColor'])}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] sm:text-xs font-cinzel border transition-all cursor-pointer ${
                    inkColor === ink.id
                      ? 'border-[#331c0a] bg-[#e2d5bd] font-bold shadow-xs'
                      : 'border-transparent hover:bg-[#ece0c8]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/20"
                    style={{ backgroundColor: ink.color }}
                  />
                  <span>{ink.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] sm:text-[10px] md:text-xs font-cinzel tracking-wider text-[#694827] uppercase mb-0.5 font-bold">
              Pesan, Doa, atau Kenangan
            </label>
            <textarea
              required
              rows={2}
              placeholder="Tuliskan kalam kenangan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-2 py-1 text-[11px] sm:text-base font-handwritten bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a] resize-none leading-snug"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-1 sm:py-1.5 bg-[#422610] hover:bg-[#5e3819] text-[#fbf5e8] rounded font-cinzel text-[10.5px] sm:text-xs font-bold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Feather className="w-3.5 h-3.5 text-[#e5b565]" />
            <span>{isSubmitting ? 'Menggoreskan...' : 'Bubuhkan Tanda Tangan'}</span>
          </button>
          {submitError && <p role="alert" className="font-source-serif text-xs text-red-900">{submitError}</p>}
        </form>

        {/* Right Footer */}
        <div className="pt-1 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-0.5">
          <span className="font-handwritten text-[10.5px] sm:text-xs text-[#704a25] truncate">
            *Tertulis di lembaran sejarah
          </span>
          <span className="shrink-0 ml-1">Hal. 13</span>
        </div>
      </div>
    </div>
  );
});
Spread4Signatures.displayName = 'Spread4Signatures';
