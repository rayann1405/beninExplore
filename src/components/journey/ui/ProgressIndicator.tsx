'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';
import { useTranslations } from 'next-intl';

const pad = (n: number) => String(n).padStart(2, '0');

// Indicateur de progression : grand numéro serif or, nom + lieu de l'étape
// active, et piste horizontale avec un marqueur-soleil par étape (or = atteinte,
// discret = à venir). L'étape active porte une pastille or.
export default function ProgressIndicator() {
  const active = useJourneyStore((s) => s.activeSectionIndex);
  const section = journey[active];
  const tJourney = useTranslations('journey');

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden flex-col gap-3 md:flex">
      <div className="flex items-end gap-3">
        <span className="font-display text-3xl font-semibold leading-none text-gold">
          {pad(active + 1)}
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/80">
            {tJourney(`sections.${section.id}.name`)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
            {tJourney(`sections.${section.id}.location`)}
          </span>
        </div>
      </div>

      <div className="relative h-[2px] w-52 bg-paper/15">
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${(active / Math.max(journey.length - 1, 1)) * 100}%` }}
        />
        {journey.map((step, i) => {
          const reached = i <= active;
          const isActive = i === active;
          return (
            <span
              key={step.id}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                isActive
                  ? 'h-3 w-3 bg-gold shadow-[0_0_10px_rgba(221,163,60,0.55)]'
                  : reached
                    ? 'h-2 w-2 bg-gold/55'
                    : 'h-2 w-2 bg-paper/25'
              }`}
              style={{ left: `${(i / Math.max(journey.length - 1, 1)) * 100}%` }}
            />
          );
        })}
      </div>
      <span aria-hidden className="flag-band h-[2px] w-52" />
    </div>
  );
}
