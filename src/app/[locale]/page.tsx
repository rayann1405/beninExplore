import ExpeditionCanvas from '@/components/journey/ExpeditionCanvas';
import JourneySections from '@/components/journey/ui/JourneySections';
import SideNav from '@/components/journey/ui/SideNav';
import ProgressIndicator from '@/components/journey/ui/ProgressIndicator';
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
      <JourneySections />
      <Outro />
      <SideNav />
      <ProgressIndicator />
    </div>
  );
}
