# 📖 Marhalah 2008 · Forza Youth Generation (Konsulat Priangan)
### *Buku Kenangan Digital Interaktif 3D & Arsip Sejarah Alumni Pondok Modern Darussalam Gontor*

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Fast-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Sound-FF8800?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Hammer.js](https://img.shields.io/badge/Gestures-Hammer.js-E05D44?style=flat-square)](https://hammerjs.github.io/)

---

## 🌟 Ikhtisar Proyek (Project Overview)

**Marhalah 2008 Memory Book** adalah aplikasi web kenangan (*digital archival memory book*) bertaraf museum yang dirancang khusus untuk mendokumentasikan jejak sejarah, falsafah lambang, direktori sahabat alumni, dan potret abadi santri angkatan **2008 — Forza Youth Generation**, khususnya keluarga besar **Konsulat Priangan** (Bandung Raya, Sumedang, Garut, Tasikmalaya, dan Ciamis), **Pondok Modern Darussalam Gontor**.

Aplikasi ini memadukan estetika *skeuomorphic* buku antik bersampul kulit marun emas dengan rekayasa grafis dan fisika web modern: daun perkamen yang melengkung saat dibalik, sintesis audio gesekan kertas secara prosedural (*zero audio asset dependencies*), serta sistem navigasi sentuh responsif berbasis **Hammer.js**.

---

## 🏛️ Filosofi Desain & Karakteristik

1. **Skeuomorfisme Bernilai Sejarah (*Antique Book Skeuomorphism*)**
   - Sampul luar (*hardcover*) kulit marun tua bertekstur alami dengan ornamen emas (*gold filigree corners*), garis timbul ganda (*double embossed border*), dan lambang Konsulat Priangan bersepuh logam mulia.
   - Efek 3D *perspective tilt* interaktif yang merespons pergerakan kursor mouse pada sampul buku.

2. **Tipografi & Tata Letak Bernuansa Santri & Pasundan**
   - Menggunakan kaligrafi Arab naskhi (**Amiri**) untuk Basmalah dan Fihris.
   - Font klasik serif (**Cinzel, Cinzel Decorative, Cormorant Garamond, Source Serif 4**) untuk menegaskan wibawa akademis Kulliyatu-l-Mu'allimin Al-Islamiyyah (KMI).
   - Tipografi goresan tangan (**Caveat**) pada catatan tepi dan tanda tangan sahabat.

3. **Multi-Viewport Adaptive Architecture**
   - **Desktop / Tablet Landscape (`≥ 768px`)**: Tampilan fisik buku terbuka berdampingan (*Two-Page Spread*) lengkap dengan bayangan lekukan punggung buku (*central spine gutter shadow*).
   - **Mobile Smartphone (`< 768px`)**: Tampilan cerdas **1 Layar = 1 Lembar Halaman Penuh (*Single Page Folio*)**. Mencegah tampilan sesak, memaksimalkan kenyamanan membaca teks, dan menghadirkan potret beresolusi tinggi.

---

## ⚙️ Fitur Utama (Core Features)

### 1. 📜 Rekayasa Fisika Lembaran Buku (*3D Parchment Page-Turn Engine*)
- Animasi pembalikan daun kertas perkamen 3D dengan kurva pantulan pegas (*spring rebound physics*).
- Transisi mulus sudut pandang 90 derajat (*midpoint leaf swap*) yang meniru kelengkungan kertas perkamen asli.
- Bayangan pendaratan dinamis (*landing shadow*) di bawah helaian yang terangkat.

### 2. 🎵 Mesin Audio Web Prosedural (*Zero Network Sound Assets*)
- Seluruh efek audio (bunyi gesekan helaian kertas, dentuman penutupan sampul kulit tebal, dan gesekan mata pena) disintesis secara *real-time* via **Web Audio API**.
- Menggunakan *noise buffer* dan *biquad filtering* ter-cache untuk mencegah *garbage collection churn* dan lonjakan memori (CPU-friendly).
- Dilengkapi tombol toggle bisu (*audio mute*) terintegrasi.

### 3. 👆 Gestur Sentuh Mobile (*Hammer.js Gesture Integration*)
- Diintegrasikan melalui *custom React hook* `useSwipeGesture`.
- Mendeteksi usapan horizontal secara cerdas (*horizontal swipe intent*) dengan diskriminasi sumbu gerak (`Math.abs(deltaX) > Math.abs(deltaY)`), membebaskan gulir vertikal teks saat pengguna membaca.
- Mendukung *fast flick gesture* (kecepatan jentikan jari > 0.22 px/ms).
- Memproteksi elemen formulir (`<input>`, `<textarea>`, `<select>`) agar pengguna dapat mengisi form tanpa sengaja membalik halaman.

### 4. 📚 Struktur Bab Kenangan
- **Hal. 00 – 01 (Muqaddimah & Daftar Bab)**: Halaman judul dedikasi, lambang resmi, dan daftar isi interaktif dengan tautan cepat ke setiap bab.
- **Hal. 04 – 07 (Bab I: Falsafah Lambang)**: Bedah tuntas 13 elemen logo Konsulat Priangan (Ruh Tauhid, Menara Gontor, Kujang Pasundan, Harimau Lodaya, Mahkota Galuh, Gunung Parahyangan, dsb.).
- **Hal. 08 – 09 (Bab II: Sijillul Asma' Sahabat Alumni)**: Direktori arsip alumni dengan pencarian instan (*live search*), filter wilayah Priangan, dan kartu biodata rapi berabjad A–Z.
- **Hal. 10 – 11 (Bab III: Album Kenangan & Potret Fisik)**: Kolase foto antik beraksen selotip washi (*washi tape*) dan sudut foto kuno (*photo corners*) dengan catatan tepi interaktif.
- **Hal. 12 – 13 (Bab IV: Catatan Tepi & Autograph)**: Buku tamu bertinta abadi dengan 4 pilihan warna tinta (Sepia, Indigo, Hitam Antik, Burgundy).
- **Hal. 14 – 15 (Bab V: Tinta Baru & Formulir Kontribusi)**: Fasilitas bagi sahabat alumni untuk mendaftarkan nama, profesi, foto profil, dan mengunggah potret kenangan baru ke dalam buku.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

| Lapisan | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **React 19** (`v19.0.1`) | Functional components, modern hooks, zero class legacy |
| **Bahasa** | **TypeScript 5.x** | *Strict type safety* untuk seluruh model data dan props |
| **Styling** | **Tailwind CSS v4** | Modern zero-runtime utility classes, responsive typography |
| **Build Tool** | **Vite 8.x** | *Ultra-fast* HMR development & optimized production rollup |
| **Interaksi Sentuh** | **Hammer.js** | Gesture manager untuk usapan layar sentuh pada perangkat mobile |
| **Audio Sintesis** | **Web Audio API** | Sintesis osilator & biquad noise buffer tanpa aset file MP3 eksternal |
| **Ikonografi** | **Lucide React** | Ikon vektor ringan dan tajam |
| **Penyimpanan Data** | **HTML5 LocalStorage** | Sinkronisasi data alumni, foto, dan tanda tangan secara persisten di browser |

---

## 📂 Struktur Direktori Proyek

```plaintext
├── public/
│   ├── logokonsul.png           # Aset visual lambang resmi Konsulat Priangan
│   └── ...
├── src/
│   ├── components/
│   │   ├── ClosedBook.tsx       # Tampilan sampul luar 3D (Depan & Belakang)
│   │   ├── OpenBook.tsx         # Tampilan buku terbuka & orchestrator halaman
│   │   ├── BackCoverFace.tsx    # Wajah sampul belakang (kalam penutup & bait puisi)
│   │   ├── MemoryModal.tsx      # Modal iluminasi detail alumni & potret kenangan
│   │   ├── Ornaments.tsx        # Ornamen antik (filigree, cap arsip, pita, washi)
│   │   └── spreads/
│   │       ├── Spread0Cover.tsx         # Hal. 00-01: Dedikasi & Fihris
│   │       ├── Spread1Story.tsx         # Hal. 04-05: Falsafah Lambang (Bagian 1)
│   │       ├── Spread1StoryPart2.tsx    # Hal. 06-07: Falsafah Lambang (Bagian 2)
│   │       ├── Spread2Alumni.tsx        # Hal. 08-09: Direktori Sijillul Asma'
│   │       ├── Spread3Photos.tsx        # Hal. 10-11: Album Arsip Fotografi
│   │       ├── Spread4Signatures.tsx    # Hal. 12-13: Goresan Tinta & Autograph
│   │       └── Spread5Contribute.tsx    # Hal. 14-15: Formulir Kontribusi Alumni
│   ├── data/
│   │   ├── logoMeaning.ts       # Uraian 13 elemen filosofi lambang
│   │   └── mockData.ts          # Data arsip sahabat, potret perdana, dan tanda tangan
│   ├── hooks/
│   │   └── useSwipeGesture.ts   # Custom hook Hammer.js untuk navigasi mobile
│   ├── utils/
│   │   ├── audio.ts             # Sintesis Web Audio API (page flip, book thud, quill)
│   │   └── paperPhysics.ts      # Kalkulasi kurva dan pegas pembalikan lembaran
│   ├── types.ts                 # Definisi tipe data TypeScript
│   ├── App.tsx                  # Root state & controller transisi buku
│   ├── main.tsx                 # Entry point aplikasi
│   └── index.css                # Global styles, font imports & tekstur perkamen
├── package.json
├── metadata.json
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek (Getting Started)

### Prasyarat:
- **Node.js**: Versi `18.x` atau lebih baru
- **NPM**: Versi `9.x` atau lebih baru

### 1. Kloning Repositori
```bash
git clone https://github.com/username/marhalah-2008-memory-book.git
cd marhalah-2008-memory-book
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

### 4. Build untuk Lingkungan Produksi
```bash
npm run build
```
Hasil build optimal akan tersimpan di direktori `dist/`.

### 5. Validasi Tipe & Kode (Lint)
```bash
npm run lint
```

---

## ⌨️ Pintasan Navigasi Keyboard

Untuk kenyamanan eksplorasi pada perangkat desktop / laptop:
- `Panah Kanan (→)` atau `Page Down`: Balik ke halaman / lembaran berikutnya.
- `Panah Kiri (←)` atau `Page Up`: Balik ke halaman / lembaran sebelumnya.
- `Escape (Esc)`: Tutup buku dan kembali ke tampilan sampul depan.

---

## 🤝 Dedikasi & Hak Cipta

Karya ini dipersembahkan dengan rasa takzim, rindu, dan ukhuwah mendalam untuk segenap sahabat santri:
* **Marhalah 2008 — Forza Youth Generation**
* **Konsulat Priangan** (Bandung, Sumedang, Garut, Tasikmalaya, Ciamis)
* **Kulliyatu-l-Mu'allimin Al-Islamiyyah (KMI), Pondok Modern Darussalam Gontor Ponorogo**

> *“Di Darussalam kami ditempa dengan Panca Jiwa, di tatar Pasundan kami mengabdi dengan keluhuran budi.”*
