# 📖 Marhalah 2008 · Forza Youth Generation (Konsulat Priangan)
### *Buku Kenangan Digital Interaktif 3D & Arsip Sejarah Alumni Pondok Modern Darussalam Gontor*

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Sound-FF8800?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Hammer.js](https://img.shields.io/badge/Gestures-Hammer.js-E05D44?style=flat-square)](https://hammerjs.github.io/)

---

## 🌟 Ikhtisar Proyek (Project Overview)

**Marhalah 2008 Memory Book** adalah aplikasi web kenangan (*digital archival memory book*) bertaraf museum yang dirancang khusus untuk mendokumentasikan jejak sejarah, falsafah lambang, direktori sahabat alumni, dan potret abadi santri angkatan **2008 — Forza Youth Generation**, khususnya keluarga besar **Konsulat Priangan** (Bandung Raya, Sumedang, Garut, Tasikmalaya, dan Ciamis), **Pondok Modern Darussalam Gontor**.

Aplikasi ini memadukan estetika *skeuomorphic* buku antik bersampul kulit marun emas dengan rekayasa grafis dan fisika web modern: daun perkamen yang melengkung saat dibalik, sintesis audio gesekan kertas secara prosedural (*zero audio asset dependencies*), serta sistem navigasi sentuh responsif berbasis **Hammer.js**. Direktori, foto, autograph, dan coretan tersimpan di Supabase dengan satu akun bersama angkatan.

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
| **Framework / Build Tool** | **Next.js App Router** | Shell App Router dengan interaksi buku pada Client Component |
| **Interaksi Sentuh** | **Hammer.js** | Gesture manager untuk usapan layar sentuh pada perangkat mobile |
| **Audio Sintesis** | **Web Audio API** | Sintesis osilator & biquad noise buffer tanpa aset file MP3 eksternal |
| **Ikonografi** | **Lucide React** | Ikon vektor ringan dan tajam |
| **Database & Auth** | **Supabase PostgreSQL / Auth** | Data buku publik; satu akun bersama terverifikasi untuk menulis lewat RLS |
| **Penyimpanan Foto** | **Supabase Storage** | File foto berada di bucket; database hanya menyimpan URL/path |
| **Migrasi lokal** | **HTML5 LocalStorage** | Autograph/catatan lama dicoba migrasikan; arsip lama tetap dapat diekspor |

---

## 📂 Struktur Direktori Proyek

```plaintext
├── app/
│   ├── layout.tsx              # Metadata, font, dan stylesheet global
│   └── page.tsx                # App Router entry untuk buku interaktif
├── supabase/
│   └── migrations/             # Skema PostgreSQL, RLS, dan Storage policies
├── scripts/
│   └── seed-mock-data.ts       # Seed mock tanpa menimpa data yang ada
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
│   ├── lib/supabase.ts          # Browser client Supabase ber-kunci publik
│   └── index.css                # Global styles, font imports & tekstur perkamen
├── package.json
├── metadata.json
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek (Getting Started)

### Prasyarat:
- **Node.js**: Versi `20.9` atau lebih baru
- **NPM**: Versi `10.x` atau lebih baru
- Proyek Supabase

### 1. Kloning Repositori
```bash
git clone https://github.com/username/marhalah-2008-memory-book.git
cd marhalah-2008-memory-book
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Supabase
Salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dari pengaturan API proyek Supabase. Isi `NEXT_PUBLIC_SHARED_ACCOUNT_USERNAME` sebagai ID login dan `NEXT_PUBLIC_SHARED_ACCOUNT_EMAIL` dengan email Auth akun bersama. Email hanya dipakai sebagai pemetaan internal ID ke Supabase Auth; UI login meminta ID dan password saja. Jangan simpan password atau secret key dalam source code.

Terapkan semua file SQL di `supabase/migrations/` secara berurutan melalui SQL Editor Supabase. Migration terakhir mengganti policy per-alumni dengan whitelist satu akun bersama, menghapus relasi akun individual, membuat tabel `signatures` dan `memory_notes`, serta menyiapkan bucket `memory-images`. Direktori, foto, autograph, dan coretan dapat dibaca publik; hanya akun bersama yang dapat menulis.

Di Supabase Auth, nonaktifkan **Allow new users to sign up**, aktifkan Email/Password dan konfirmasi email. Buat satu user di **Authentication → Users → Add user** memakai email akun bersama, atur password langsung di Dashboard, lalu konfirmasi email. Ambil UUID user tersebut dan daftarkan pada konfigurasi privat dengan SQL Editor:
```sql
insert into private.shared_account_config (singleton, user_id)
select true, id
from auth.users
where email = 'alamat-akun-bersama@example.com'
   and email_confirmed_at is not null
on conflict (singleton) do update set user_id = excluded.user_id;
```
Ganti email contoh dengan alamat akun bersama. Tabel konfigurasi tidak dapat dibaca atau ditulis oleh role browser. Aplikasi menerima ID `knzt`, lalu memetakannya ke email bersama dari environment; Supabase tetap memvalidasi password. Aplikasi tidak menyediakan registrasi, role management, maupun dashboard admin.

Untuk mengisi data awal `mockData.ts`, tambahkan `SUPABASE_SERVICE_ROLE_KEY` hanya ke `.env.local` saat menjalankan skrip seed lokal:
```bash
npm run seed:mock
```
Skrip menambahkan baris mock yang belum ada dan tidak memperbarui atau menghapus data tersimpan. Service-role key hanya diperlukan untuk seed satu kali; jangan pasang key ini di browser atau environment deploy.

Backup LocalStorage lama tidak dihapus. Buka buku, pilih **Pita Bab** lalu ikon akun untuk mengekspornya. Saat akun bersama pertama kali masuk, autograph dan coretan lokal yang terkait dengan foto yang sudah ada dicoba dimigrasikan dengan ID idempotent. Foto lokal tanpa pasangan row database/Storage tetap tersedia di arsip ekspor.

Perubahan profil, foto, autograph, dan coretan baru disimpan ke PostgreSQL/Storage. Foto kenangan kolektif ditautkan sebagai kontribusi Forza Youth, bukan ke satu alumni. Karena semua perubahan memakai satu akun bersama, sistem tidak dapat memastikan alumni mana yang melakukan perubahan; nama pada autograph/catatan hanya atribusi tampilan yang diketik pengguna.

### 4. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Aplikasi aktif di `http://localhost:3000`.

Masuk memakai ID `knzt` dan password akun bersama. Jika autentikasi ditolak, pastikan email user sudah terkonfirmasi dan UUID-nya terdaftar di `private.shared_account_config`.

### Deploy
Deploy project Next.js (misalnya ke Vercel), lalu set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SHARED_ACCOUNT_USERNAME`, dan `NEXT_PUBLIC_SHARED_ACCOUNT_EMAIL` pada environment production. Atur **Site URL** dan redirect URL Supabase Auth ke domain deploy. Jangan tambahkan password atau `SUPABASE_SERVICE_ROLE_KEY` ke environment browser/`NEXT_PUBLIC_*`; service-role key tidak dibutuhkan runtime.

### 5. Build untuk Lingkungan Produksi
```bash
npm run build
```
Build Next.js tersimpan di direktori `.next/`.

### 6. Validasi Tipe & Kode
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
