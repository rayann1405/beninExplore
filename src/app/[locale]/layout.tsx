import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
});

const ibmSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-sans',
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
    <html lang={locale} className={`${bricolage.variable} ${ibmSans.variable} ${ibmMono.variable}`}>
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
