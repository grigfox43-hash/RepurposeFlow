import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RepurposeFlow — Превратите 1 подкаст или созвон в 15 публикаций за 3 минуты',
  description:
    'Медиа-комбайн на базе Gemini. Автоматическая дистрибуция контента в LinkedIn, VC.ru, Reels, Telegram и Email.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
