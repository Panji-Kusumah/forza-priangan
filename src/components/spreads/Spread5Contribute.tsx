import React, { useEffect, useState, useRef, memo } from 'react';
import { Alumnus, MemoryPhoto } from '../../types';
import { CornerFiligree, ChapterDivider, ArchivalStamp } from '../Ornaments';
import { Upload, Camera, UserPlus, CheckCircle2 } from 'lucide-react';
import { playQuillSound } from '../../utils/audio';

interface Spread5ContributeProps {
  alumniList: Alumnus[];
  onAddAlumnus: (alumnus: Alumnus, file?: File, editingId?: string) => Promise<void>;
  onAddMemoryPhoto: (photo: MemoryPhoto, file?: File) => Promise<void>;
  isAuthenticated: boolean;
  onRequestAuthentication: () => void;
  onNavigate: (spreadIndex: number) => void;
  mobilePageSide?: 'left' | 'right';
}

export const Spread5Contribute = memo<Spread5ContributeProps>(({
  alumniList,
  onAddAlumnus,
  onAddMemoryPhoto,
  isAuthenticated,
  onRequestAuthentication,
  onNavigate,
  mobilePageSide = 'left',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'photo'>('profile');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingAlumnusId, setEditingAlumnusId] = useState('');

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [kunya, setKunya] = useState('');
  const [prianganRegion, setPrianganRegion] = useState('Bandung Raya');
  const [rayonGontor, setRayonGontor] = useState('Gedung Saudi Lt. 2');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [quote, setQuote] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('/logokonsul.png');
  const [profileFile, setProfileFile] = useState<File | null>(null);

  // Photo Form States
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoYear, setPhotoYear] = useState('2007');
  const [photoLocation, setPhotoLocation] = useState('Konsulat Priangan / Gontor');
  const [photoCategory, setPhotoCategory] = useState<MemoryPhoto['category']>('Konsulat Priangan');
  const [uploaderName, setUploaderName] = useState('');
  const [memoryPhotoUrl, setMemoryPhotoUrl] = useState('/logokonsul.png');
  const [memoryFile, setMemoryFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const selectedAlumnus = alumniList.find((alumnus) => alumnus.id === editingAlumnusId);
    if (!selectedAlumnus) {
      setFullName('');
      setKunya('');
      setPrianganRegion('Bandung Raya');
      setRayonGontor('Gedung Saudi Lt. 2');
      setCity('');
      setOccupation('');
      setQuote('');
      setProfilePhoto('/logokonsul.png');
      setProfileFile(null);
      return;
    }
    setFullName(selectedAlumnus.fullName);
    setKunya(selectedAlumnus.kunya);
    setPrianganRegion(selectedAlumnus.prianganRegion);
    setRayonGontor(selectedAlumnus.rayonGontor ?? selectedAlumnus.dormitory ?? '');
    setCity(selectedAlumnus.city);
    setOccupation(selectedAlumnus.occupation);
    setQuote(selectedAlumnus.quote);
    setProfilePhoto(selectedAlumnus.photoUrl);
    setProfileFile(null);
  }, [alumniList, editingAlumnusId]);

  useEffect(() => () => {
    if (profilePhoto.startsWith('blob:')) URL.revokeObjectURL(profilePhoto);
    if (memoryPhotoUrl.startsWith('blob:')) URL.revokeObjectURL(memoryPhotoUrl);
  }, [profilePhoto, memoryPhotoUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'profile' | 'memory') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (target === 'profile') {
        setProfileFile(file);
        setProfilePhoto(preview);
      } else {
        setMemoryFile(file);
        setMemoryPhotoUrl(preview);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    if (!isAuthenticated) {
      setSubmitError('Masuk dengan akun terverifikasi untuk menyimpan profil.');
      onRequestAuthentication();
      return;
    }

    const newAlumnus: Alumnus = {
      id: editingAlumnusId || `alm-priangan-${Date.now()}`,
      fullName: fullName.trim(),
      kunya: kunya.trim() || 'Sahabat 2008',
      consulat: 'Konsulat Priangan',
      prianganRegion,
      stambuk: `08.${Math.floor(1400 + Math.random() * 200)}`,
      city: city.trim() || prianganRegion,
      rayonGontor: rayonGontor.trim() || 'Gedung Saudi',
      occupation: occupation.trim() || 'Alumni Gontor 2008',
      quote: quote.trim() || 'Ukhuwah santri Priangan abadi selamanya.',
      bio: 'Alumni Gontor Konsulat Priangan Marhalah 2008 Forza Youth Generation.',
      photoUrl: profilePhoto,
      favoriteMemory: quote.trim(),
    };

    setSubmitError(null);
    try {
      await onAddAlumnus(newAlumnus, profileFile ?? undefined, editingAlumnusId || undefined);
      playQuillSound();
      setSubmitted('Profil sahabat berhasil disimpan.');
      setTimeout(() => onNavigate(3), 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Profil gagal disimpan.');
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    if (!isAuthenticated) {
      setSubmitError('Masuk dengan akun terverifikasi untuk mengunggah foto.');
      onRequestAuthentication();
      return;
    }
    if (!memoryFile) {
      setSubmitError('Pilih berkas foto dari perangkat sebelum menyimpan.');
      return;
    }

    const newPhoto: MemoryPhoto = {
      id: `mem-custom-${Date.now()}`,
      title: photoTitle.trim(),
      caption: photoCaption.trim() || 'Kenangan masa berjuang di pondok.',
      year: photoYear,
      location: photoLocation,
      category: photoCategory,
      photoUrl: memoryPhotoUrl,
      uploaderName: uploaderName.trim() || 'Sahabat 2008',
      tilt: (Math.random() - 0.5) * 4,
      mounting: Math.random() > 0.5 ? 'tape' : 'corners',
      marginNotes: [],
    };

    setSubmitError(null);
    try {
      await onAddMemoryPhoto(newPhoto, memoryFile);
      playQuillSound();
      setSubmitted('Foto kenangan berhasil disimpan.');
      setTimeout(() => onNavigate(4), 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Foto gagal disimpan.');
    }
  };

  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none">
      {/* LEFT PAGE: Hal. 14 - Introduction & Mode Selector */}
      <div
        className={`${
          mobilePageSide === 'right' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full md:border-r border-[#cfbe9e]/50 p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-left" className="absolute top-2 left-2 sm:top-3 sm:left-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        <div className="shrink-0">
          <div className="text-[9px] sm:text-xs font-cinzel tracking-[0.2em] text-[#78532c] uppercase font-bold truncate">
            Bab Kelima · Tinta Baru
          </div>
          <h2 className="font-cinzel text-xs sm:text-lg md:text-xl font-black tracking-[0.08em] text-[#331c0a] uppercase leading-tight mt-0.5 truncate">
            Menorehkan Catatan ke Buku Kenangan
          </h2>
          <div className="font-source-serif italic text-[9.5px] sm:text-xs md:text-sm text-[#694827] truncate">
            Setiap alumni berhak mengisi lembaran abadi ini
          </div>
          <div className="w-full my-0.5">
            <ChapterDivider arabic="مُشَارَكَةُ الذِّكْرَى" />
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col justify-evenly gap-3 px-0.5 py-2 overflow-y-auto book-scroll">
          <p className="text-[11px] sm:text-sm md:text-base font-source-serif leading-relaxed text-[#402c1b]">
            Buku kenangan ini bukan milik segelintir orang. Sebagai santri Marhalah 2008 Forza Youth, namamu, suaramu, dan potret kenanganmu adalah bagian yang tak terpisahkan dari sejarah besar ini.
          </p>

          {/* Mode Switcher */}
          <div className="p-1 sm:p-1.5 rounded-lg bg-[#ece0c8] border border-[#cfbe9e] flex gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1 sm:py-1.5 px-1.5 rounded text-[10px] sm:text-xs font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#402511] text-[#fbeed4] shadow-xs'
                  : 'text-[#5e432a] hover:text-[#321c0b]'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Profil Sahabat</span>
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-1 sm:py-1.5 px-1.5 rounded text-[10px] sm:text-xs font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'photo'
                  ? 'bg-[#402511] text-[#fbeed4] shadow-xs'
                  : 'text-[#5e432a] hover:text-[#321c0b]'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Foto Album</span>
            </button>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg border border-dashed border-[#bda682] bg-[#fbf5e8]/80 text-[10px] sm:text-xs font-source-serif italic text-[#593c20] leading-snug">
            {activeTab === 'profile'
              ? 'Daftarkan nama & data sahabat yang belum tercatat. Seluruh kolom tersusun rapi abjad A–Z di Bab II tanpa menimpa data yang telah ada.'
              : 'Formulir ini akan menempelkan foto kenangan lama/baru ke Bab III (Album Kenangan) agar sahabat lain dapat membubuhi coretan pinggir.'}
          </div>

          {submitted && (
            <div className="p-1.5 rounded-lg bg-emerald-950/15 border border-emerald-800/40 text-emerald-950 font-cinzel text-[10px] sm:text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-semibold">{submitted}</span>
            </div>
          )}
          {submitError && (
            <div role="alert" className="p-1.5 rounded bg-red-950/10 border border-red-800/40 text-red-950 font-source-serif text-[10px] sm:text-xs">
              {submitError}
            </div>
          )}
        </div>

        {/* Left Footer */}
        <div className="pt-1 border-t border-[#d8c7a6]/60 flex items-center justify-between font-source-serif font-bold text-[#825c35] text-[10px] sm:text-xs shrink-0 mt-0.5">
          <ArchivalStamp text="KONTRIBUSI ALUMNI" subtext="FORZA YOUTH" year="1447 H" color="sepia" />
          <span>Hal. 14</span>
        </div>
      </div>

      {/* RIGHT PAGE: Hal. 15 - Unified Form */}
      <div
        className={`${
          mobilePageSide === 'left' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/2 h-full p-1.5 sm:p-3 md:p-4 lg:p-5 flex-col justify-between relative overflow-y-auto book-scroll`}
      >
        <CornerFiligree position="top-right" className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 pointer-events-none opacity-80" gold={false} />

        {activeTab === 'profile' ? (
          /* Profile Form */
          <form onSubmit={handleProfileSubmit} className="flex flex-1 min-h-0 flex-col justify-evenly gap-1.5 py-2 overflow-y-auto book-scroll">
            <div className="shrink-0 flex items-center justify-between pb-0.5 border-b border-[#dfd0b5]/80">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-cinzel font-black text-[#502e11] uppercase tracking-wider block truncate">
                  Formulir Sijillul Asma&apos; Sahabat
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-source-serif italic text-[#755535] truncate block">
                  {editingAlumnusId ? 'Perbarui data alumni terpilih' : 'Tambahkan alumni ke sijillul asma'}
                </span>
              </div>
            </div>

            <label className="block shrink-0 text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
              Profil alumni
              <select
                value={editingAlumnusId}
                onChange={(event) => setEditingAlumnusId(event.target.value)}
                className="mt-0.5 w-full px-1.5 py-1 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] normal-case tracking-normal"
              >
                <option value="">Tambah alumni baru</option>
                {alumniList.map((alumnus) => (
                  <option key={alumnus.id} value={alumnus.id}>{alumnus.fullName}</option>
                ))}
              </select>
            </label>

            {/* Photo Avatar + Nama Lengkap & Laqob */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 my-1 shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-10 h-12 sm:w-12 sm:h-14 bg-[#ebd9bd] border-2 border-dashed border-[#a68661] rounded cursor-pointer flex flex-col items-center justify-center overflow-hidden shrink-0 group hover:border-[#523315]"
                title="Pilih foto profil sahabat"
              >
                <img
                  src={profilePhoto}
                  alt="Preview"
                  className="w-full h-full object-cover grayscale contrast-110 sepia-[0.3]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-cinzel">
                  <Upload className="w-3 h-3 mb-0.5" />
                  <span>Ubah</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'profile')}
                className="hidden"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Dzulfikar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                    Laqob / Panggilan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kang Dzul"
                    value={kunya}
                    onChange={(e) => setKunya(e.target.value)}
                    className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                  />
                </div>
              </div>
            </div>

            {/* Region & Dorm */}
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 shrink-0">
              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Wilayah Priangan
                </label>
                <select
                  value={prianganRegion}
                  onChange={(e) => setPrianganRegion(e.target.value)}
                  className="w-full px-1 py-0.5 text-[9.5px] sm:text-xs font-cinzel bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a] font-semibold cursor-pointer truncate"
                >
                  <option value="Bandung Raya">Bandung Raya</option>
                  <option value="Sumedang">Sumedang</option>
                  <option value="Garut">Garut</option>
                  <option value="Tasik">Tasik</option>
                  <option value="Ciamis">Ciamis</option>
                </select>
              </div>

              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Asrama di Gontor
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Saudi Lt. 2"
                  value={rayonGontor}
                  onChange={(e) => setRayonGontor(e.target.value)}
                  className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                />
              </div>
            </div>

            {/* City & Profession */}
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 shrink-0 mt-0.5">
              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Domisili / Kota
                </label>
                <input
                  type="text"
                  placeholder="Bandung / Tasikmalaya"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                />
              </div>

              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Khidmat / Profesi
                </label>
                <input
                  type="text"
                  placeholder="Wiraswasta / Asatidz"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                />
              </div>
            </div>

            {/* Kalam Kenangan Quote */}
            <div className="shrink-0 mt-0.5">
              <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                Kalam Kenangan / Motto Hidup
              </label>
              <textarea
                rows={1}
                placeholder="Pesan ukhuwah atau motto hidup..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif italic bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a] resize-none leading-tight"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-1 sm:py-1.5 bg-[#422610] hover:bg-[#5e3819] text-[#fbf5e8] rounded font-cinzel text-[10.5px] sm:text-xs font-bold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 mt-1"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#e5b565]" />
              <span>{editingAlumnusId ? 'Simpan Perubahan Alumni' : 'Tambahkan Alumni'}</span>
            </button>
          </form>
        ) : (
          /* Photo Form */
          <form onSubmit={handlePhotoSubmit} className="flex flex-1 min-h-0 flex-col justify-evenly gap-1.5 py-2 overflow-y-auto book-scroll">
            <div className="shrink-0 flex items-center justify-between pb-0.5 border-b border-[#dfd0b5]/80">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-cinzel font-black text-[#502e11] uppercase tracking-wider block truncate">
                  Formulir Tempel Foto Kenangan
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-source-serif italic text-[#755535] truncate block">
                  Tempelkan potret fisik ke Bab III Album Kenangan
                </span>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div
              onClick={() => photoFileInputRef.current?.click()}
              className="relative aspect-video max-h-[14vh] sm:max-h-[18vh] bg-[#ebd9bd] border-2 border-dashed border-[#a68661] rounded cursor-pointer flex flex-col items-center justify-center overflow-hidden shrink-0 group hover:border-[#523315] my-1"
            >
              <img
                src={memoryPhotoUrl}
                alt="Preview Kenangan"
                className="w-full h-full object-cover grayscale contrast-110 sepia-[0.3]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-cinzel">
                <Upload className="w-4 h-4 mb-0.5" />
                <span>Pilih Foto dari Galeri</span>
              </div>
            </div>
            <input
              ref={photoFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'memory')}
              className="hidden"
            />

            <div className="space-y-1 shrink-0">
              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Reuni Konsulat Priangan"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                <div>
                  <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={photoYear}
                    onChange={(e) => setPhotoYear(e.target.value)}
                    className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={photoLocation}
                    onChange={(e) => setPhotoLocation(e.target.value)}
                    className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8.5px] sm:text-[10px] font-cinzel tracking-wider text-[#694827] uppercase font-bold">
                  Kisah / Catatan Foto
                </label>
                <textarea
                  rows={1}
                  placeholder="Ceritakan momen di balik foto ini..."
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-1.5 py-0.5 text-[10px] sm:text-xs font-source-serif bg-[#f3ebd8] border border-[#bfa683] rounded text-[#3d2919] focus:outline-none focus:border-[#7d512a] resize-none leading-tight"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-1 sm:py-1.5 bg-[#422610] hover:bg-[#5e3819] text-[#fbf5e8] rounded font-cinzel text-[10.5px] sm:text-xs font-bold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 mt-1"
            >
              <Camera className="w-3.5 h-3.5 text-[#e5b565]" />
              <span>Tempelkan Foto</span>
            </button>
          </form>
        )}

        {/* Right Footer */}
        <div className="pt-1 border-t border-[#d8c7a6]/60 flex items-center justify-between text-[10px] sm:text-xs font-source-serif font-bold text-[#825c35] shrink-0 mt-0.5">
          <span className="font-handwritten text-[10.5px] sm:text-xs text-[#704a25] truncate">
            *Tersimpan dalam arsip marhalah
          </span>
          <span className="shrink-0 ml-1">Hal. 15</span>
        </div>
      </div>
    </div>
  );
});
Spread5Contribute.displayName = 'Spread5Contribute';
