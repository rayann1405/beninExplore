import MapHero from '@/components/map/MapHero';
import CategoryFilters from '@/components/map/CategoryFilters';
import JourneyOverlay from '@/components/journey/JourneyOverlay';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function HomePage({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative w-full bg-background">
      <MapHero />
      <JourneyOverlay />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <CategoryFilters />
        </div>
      </div>
    </div>
  );
}
