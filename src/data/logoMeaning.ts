/**
 * =========================================================================
 * PANDUAN MENGUBAH / MENGEDIT ARTI SETIAP ELEMEN LOGO KONSULAT PRIANGAN
 * =========================================================================
 * 
 * File ini berisi 13 makna filosofis dari Lambang Konsulat Priangan 2008.
 * Anda dapat dengan bebas mengubah:
 * - `title`: Nama elemen logo (misal: "MASJID GALUH SILIWANGI")
 * - `category`: Kategori elemen (misal: "Ruh & Keislaman", "Pasundan", "Warna")
 * - `meaning`: Deskripsi dan makna lengkap dari elemen tersebut
 * - `icon`: Simbol representatif elemen
 * 
 * Setiap perubahan yang Anda simpan di sini akan langsung tampil pada
 * Halaman 04 (Bab I: Falsafah & Makna Lambang Konsulat Priangan).
 * =========================================================================
 */

export interface LogoElementMeaning {
  id: number;
  title: string;
  category: string;
  meaning: string;
  icon?: string;
  highlightColor?: string;
}

export const LOGO_ELEMENTS: LogoElementMeaning[] = [
  {
    id: 1,
    title: 'MASJID GALUH SILIWANGI',
    category: 'Ruh & Peradaban',
    icon: '🕌',
    highlightColor: '#2b5e3b',
    meaning:
      'Melambangkan Islam sebagai ruh, pusat peradaban, tempat ibadah, ilmu, dan pembinaan akhlak. Masjid di tengah logo menunjukkan bahwa setiap langkah kehidupan berakar pada iman dan akhlak.',
  },
  {
    id: 2,
    title: 'MENARA GONTOR',
    category: 'Pendidikan & Tradisi',
    icon: '🗼',
    highlightColor: '#8a5223',
    meaning:
      'Simbol ilmu pengetahuan, pendidikan, kedisiplinan dan cita-cita yang tinggi. Menara Gontor menggambarkan tradisi pesantren, persatuan, serta pandangan yang jauh ke depan.',
  },
  {
    id: 3,
    title: 'KUJANG',
    category: 'Jati Diri Pasundan',
    icon: '🗡️',
    highlightColor: '#b45309',
    meaning:
      'Simbol jati diri tanah Pasundan, keteguhan prinsip, keberanian, perlindungan, kehormatan dan kesetiaan terhadap budaya Sunda. Kujang menggambarkan harmoni antara identitas budaya dan nilai agama.',
  },
  {
    id: 4,
    title: 'MAUNG SILIWANGI',
    category: 'Karakter & Kewibawaan',
    icon: '🐅',
    highlightColor: '#d97706',
    meaning:
      'Melambangkan keberanian, kewibawaan, kepemimpinan, dan harga diri. Maung Siliwangi adalah karakter yang kuat namun tetap menjaga kehormatan. Berani, tegas, dan berjiwa luhur.',
  },
  {
    id: 5,
    title: 'KERAJAAN GALUH',
    category: 'Akar Historis',
    icon: '👑',
    highlightColor: '#ca8a04',
    meaning:
      'Mahkota dan ornamen kerajaan melambangkan warisan leluhur, kepemimpinan, kehormatan dan tanggung jawab. Kerajaan Galuh adalah akar historis yang menguatkan identitas dan jati diri.',
  },
  {
    id: 6,
    title: 'GUNUNG PRIANGAN',
    category: 'Tanah Leluhur',
    icon: '⛰️',
    highlightColor: '#365314',
    meaning:
      'Pegunungan melambangkan tanah Priangan, keteguhan, kekokohan dan akar leluhur. Setinggi apa pun cita-cita, jangan pernah melupakan tanah tempat akar tumbuh.',
  },
  {
    id: 7,
    title: 'AWAN & ORNAMEN SUNDA',
    category: 'Seni & Keluhuran',
    icon: '☁️',
    highlightColor: '#0284c7',
    meaning:
      'Awan melambangkan keluhuran, ketenangan dan perjalanan kehidupan. Ornamen Sunda memberikan sentuhan seni tradisional yang memperindah serta memperkuat identitas budaya.',
  },
  {
    id: 8,
    title: 'BULAN SABIT',
    category: 'Spiritualitas Islam',
    icon: '🌙',
    highlightColor: '#0f766e',
    meaning:
      'Simbol Islam, iman, harapan, cahaya dan perjalanan spiritual. Menunjukkan bahwa seluruh kehidupan berada dalam naungan nilai-nilai ketuhanan.',
  },
  {
    id: 9,
    title: 'LINGKARAN EMAS',
    category: 'Persatuan & Ukhuwah',
    icon: '⭕',
    highlightColor: '#d97706',
    meaning:
      'Melambangkan persatuan dan kesatuan. Menyatukan seluruh elemen dalam satu ikatan yang tidak terputus. Menggambarkan kesinambungan generasi dan kekuatan bersama.',
  },
  {
    id: 10,
    title: 'KITAB TERBUKA',
    category: 'Ilmu & Kebijaksanaan',
    icon: '📖',
    highlightColor: '#78350f',
    meaning:
      'Dua bidang di bagian bawah menyerupai kitab terbuka. Melambangkan ilmu, pendidikan, pengetahuan dan perjalanan hidup yang harus bertemu pada nilai agama dan kebijaksanaan.',
  },
  {
    id: 11,
    title: 'WARNA HIJAU - MERAH - PUTIH',
    category: 'Tri-Warna Fondasi',
    icon: '🎨',
    highlightColor: '#15803d',
    meaning:
      'Hijau: kesejukan, Islam, kehidupan dan harapan. Merah: keberanian, semangat dan perjuangan. Putih: kesucian, ketulusan dan niat yang bersih. Ketiganya menjadi fondasi nilai yang menopang seluruh lambang.',
  },
  {
    id: 12,
    title: 'WARNA EMAS',
    category: 'Kejayaan & Nilai Luhur',
    icon: '✨',
    highlightColor: '#ca8a04',
    meaning:
      'Melambangkan kemuliaan, kejayaan, kehormatan dan kualitas. Emas bukan sekadar kemewahan, tetapi nilai berharga yang harus dijaga dalam sejarah, ilmu, agama, budaya dan persaudaraan.',
  },
  {
    id: 13,
    title: 'ANGKA 2008',
    category: 'Tonggak Sejarah',
    icon: '⏳',
    highlightColor: '#92400e',
    meaning:
      'Menandakan tahun awal perjalanan atau tonggak berdirinya identitas ini. Sebagai pengingat bahwa sebuah jati diri dibangun melalui proses, sejarah dan perjuangan.',
  },
];
