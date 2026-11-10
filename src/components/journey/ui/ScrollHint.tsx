'use client';
import { useTranslations } from 'next-intl';
import { useJourneyStore } from '@/lib/store';

// Invitation à défiler, visible uniquement sur la première étape : filet
// vertical avec un point doré qui descend — geste, pas icône générique.
export default function ScrollHint() {
  const t = useTranslations('common');
  const active = useJourneyStore((s) => s.activeSectionIndex);
  if (active > 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-flag-yellow">
        {t('scrollHint')}
      </span>
      <div className="relative h-8 w-px overflow-hidden bg-flag-yellow/25">
        <span className="scroll-cue absolute left-0 top-0 h-2 w-px bg-flag-yellow" />
      </div>
      <span aria-hidden className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-flag-green" />
        <span className="h-1.5 w-1.5 rounded-full bg-flag-yellow" />
        <span className="h-1.5 w-1.5 rounded-full bg-flag-red" />
      </span>
    </div>
  );
}
