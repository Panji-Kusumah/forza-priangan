export type PrianganRegion = 'Bandung Raya' | 'Sumedang' | 'Garut' | 'Tasik' | 'Ciamis';

export interface Alumnus {
  id: string;
  fullName: string;
  kunya: string; // Nickname / Laqob in pesantren (e.g. Kang Hilman / Kang Dadan)
  consulat: string; // "Konsulat Priangan"
  prianganRegion: string; // Daerah Priangan murni: "Bandung Raya", "Sumedang", "Garut", "Tasik", "Ciamis"
  stambuk: string; // Student ID e.g. "08.1408"
  city: string;
  occupation: string;
  quote: string; // Famous quote or memory line
  bio: string;
  photoUrl: string;
  favoriteMemory: string;
  contact?: string;
  dormitory?: string; // Asrama e.g. "Saudi Lt 2", "Wisma USM", "Al-Azhar"
  rayonGontor?: string; // Rayon / Asrama di Gontor
  email?: string;
}

export interface MarginComment {
  id: string;
  author: string;
  authorKunya?: string;
  text: string;
  date: string;
  inkColor?: 'sepia' | 'indigo' | 'black' | 'burgundy';
  rotation?: number; // Subtle tilt for handwritten look
}

export interface MemoryPhoto {
  id: string;
  title: string;
  caption: string;
  year: string;
  location: string;
  category: 'Konsulat Priangan' | 'Asrama' | 'Panggung Gembira' | 'Ujian Nihai' | 'Dapur & Keseharian' | 'Pramuka & Olahraga' | 'Reuni';
  photoUrl: string;
  uploaderName: string;
  uploaderKunya?: string;
  tilt: number;
  mounting: 'tape' | 'corners' | 'polaroid' | 'pin';
  marginNotes: MarginComment[];
}

export interface SignatureEntry {
  id: string;
  name: string;
  kunya: string;
  consulat: string;
  message: string;
  date: string;
  inkColor: 'sepia' | 'indigo' | 'black' | 'burgundy';
  handStyle: 'neat' | 'cursive' | 'bold';
  rotation: number;
}

export interface Milestone {
  year: string;
  date: string;
  title: string;
  arabicSubtitle?: string;
  description: string;
}
