'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';

// Indicateur de progression : étape active / total + nom de l'étape.
export default function ProgressIndicator() {
  const active = useJourneyStore((s) => s.activeSectionIndex);
  const section = journey[active];

  return (
    <div className="fixed bottom-5 left-5 z-40 font-mono text-xs text-paper/70">
      <span className="text-gold">{String(active + 1).padStart(2, '0')}</span>
      <span> / {String(journey.length).padStart(2, '0')}</span>
      <span className="ml-3 hidden text-paper/50 sm:inline">{section.name}</span>
    </div>
  );
}
