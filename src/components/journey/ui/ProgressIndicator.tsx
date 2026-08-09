'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';

// Indicateur de progression : compteur, barre bronze et nom de l'étape active.
export default function ProgressIndicator() {
  const active = useJourneyStore((s) => s.activeSectionIndex);
  const section = journey[active];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden flex-col gap-3 md:flex">
      <div className="flex items-baseline gap-3 font-mono text-xs tracking-widest">
        <span className="text-lg text-gold">{String(active + 1).padStart(2, '0')}</span>
        <span className="text-paper/40">/ {String(journey.length).padStart(2, '0')}</span>
        <span className="ml-1 max-w-40 truncate text-paper/70">{section.name}</span>
      </div>
      <div className="relative h-px w-44 bg-paper/15">
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${((active + 1) / journey.length) * 100}%` }}
        />
        <span
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gold transition-[left] duration-500 ease-out"
          style={{ left: `calc(${((active + 1) / journey.length) * 100}% - 4px)` }}
        />
      </div>
    </div>
  );
}
