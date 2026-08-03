'use client';
import { useTranslations } from 'next-intl';
import { useMapStore } from '@/lib/store';
import { Map as MapIcon, Route } from 'lucide-react';

// Switches between the scrolled journey (default) and the free-orbit map.
export default function ModeToggle() {
  const t = useTranslations('common');
  const { mode, setMode } = useMapStore();

  const label = mode === 'journey' ? t('freeExplore') : t('backToJourney');

  return (
    <button
      type="button"
      onClick={() => setMode(mode === 'journey' ? 'free' : 'journey')}
      className="pointer-events-auto flex items-center gap-2 rounded-full border border-paper/15 bg-ink/80 backdrop-blur-md px-4 py-2 text-sm font-sans text-paper hover:border-laterite hover:text-laterite-light transition-colors shadow-xl"
    >
      {mode === 'journey' ? <MapIcon size={15} /> : <Route size={15} />}
      {label}
    </button>
  );
}
