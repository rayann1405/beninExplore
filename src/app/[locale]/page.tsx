import ExpeditionCanvas from '@/components/journey/ExpeditionCanvas';
import JourneySections from '@/components/journey/ui/JourneySections';
import SideNav from '@/components/journey/ui/SideNav';
import ProgressIndicator from '@/components/journey/ui/ProgressIndicator';
import ScrollHint from '@/components/journey/ui/ScrollHint';
import Outro from '@/components/journey/ui/Outro';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function HomePage({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative">
      {/* Canvas 3D fixe en arrière-plan, sous les sections DOM */}
      <ExpeditionCanvas />

      {/* Vignette cinématique + grain par-dessus la scène */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(4,3,2,0.62)_100%)]"
      />
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[1] opacity-[0.05]" />

      <JourneySections />
      <Outro />
      <ScrollHint />
      <SideNav />
      <ProgressIndicator />
    </div>
  );
}
