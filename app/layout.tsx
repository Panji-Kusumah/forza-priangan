import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Marhalah 2008 · Forza Youth Generation Memory Book',
  description:
    'Buku Kenangan Digital Alumni Marhalah 2008 Forza Youth Generation, Pondok Modern Darussalam Gontor. Lembaran kisah, arsip alumni, dan kenangan abadi.',
  icons: { icon: '/logokonsul.png' },
  openGraph: {
    title: 'Marhalah 2008 · Forza Youth Generation Memory Book',
    description:
      'Buku Kenangan Digital Alumni Marhalah 2008 Forza Youth Generation, Pondok Modern Darussalam Gontor.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Caveat:wght@400;600;700&family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400;1,8..60,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#120a06] text-[#2c1d11] antialiased select-none overflow-x-hidden selection:bg-[#c99e52]/30 selection:text-[#3a220f]">
        {children}
      </body>
    </html>
  );
}