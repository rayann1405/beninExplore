import localFont from 'next/font/local';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

// Fraunces : titres — serif éditorial inspiré des archives et du patrimoine.
// IBM Plex Sans : corps. IBM Plex Mono : labels/étapes.
const fraunces = localFont({
  src: './fonts/fraunces-latin.woff2',
  weight: '100 900',
  variable: '--font-fraunces',
  display: 'swap',
});

const ibmSans = localFont({
  src: './fonts/ibm-plex-sans-latin.woff2',
  weight: '100 700',
  variable: '--font-ibm-sans',
  display: 'swap',
});

const ibmMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-400-latin.woff2', weight: '400' },
    { path: './fonts/ibm-plex-mono-500-latin.woff2', weight: '500' },
  ],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bénin Explore',
  description:
    'Un parcours immersif à travers le patrimoine, la culture et l’histoire du Bénin.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${ibmSans.variable} ${ibmMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
