import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Lentera Pasar - Dashboard',
  description: 'Dashboard manajemen website, bagian halaman, profil bisnis, dan pelacakan insight Lentera Pasar untuk owner bisnis.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

