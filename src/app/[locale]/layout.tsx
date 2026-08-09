import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Marcellus, Sen, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

// Marcellus : serif classique « gravé dans la pierre », en écho aux statues
// et bas-reliefs d'Abomey. Sen : sans géométrique dessinée par un designer
// ouest-africain (Mono Lisa) — le volet moderne du duo tradition/modernité.
const marcellus = Marcellus({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-marcellus',
});

const sen = Sen({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sen',
});

const ibmMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${marcellus.variable} ${sen.variable} ${ibmMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 relative">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
