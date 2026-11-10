'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';
import { prefersReducedMotion } from '../scroll/useJourneyScroll';
import Motif from './Motif';
import { useTranslations } from 'next-intl';

// Menu latéral fixe : fil vertical, un marqueur-soleil par étape, actif en or.
// Clic = défilement fluide vers la section (direct si reduced-motion).
export default function SideNav() {
  const active = useJourneyStore((s) => s.activeSectionIndex);
  const tJourney = useTranslations('journey');

  const go = (index: number) => {
    document
      .querySelector(`[data-section="${index}"]`)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label={tJourney('navLabel')}
      className="fixed right-5 top-1/2 z-40 -translate-y-1/2 md:right-8"
    >
      <div aria-hidden className="absolute bottom-2 left-[9px] top-2 w-px bg-paper/10" />
      <ul className="flex flex-col">
        {journey.map((section, i) => {
          const isActive = i === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`${tJourney(`sections.${section.id}.name`)} — ${tJourney(
                  `sections.${section.id}.location`
                )}`}
                aria-current={isActive}
                className="group relative flex h-9 w-8 cursor-pointer items-center justify-center"
              >
                <span
                  className={`pointer-events-none absolute right-11 hidden flex-col items-start gap-0.5 whitespace-nowrap border border-gold/20 bg-ink/90 px-2.5 py-1.5 backdrop-blur transition-all duration-200 group-hover:opacity-100 md:flex ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/85">
                    <span className="text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {tJourney(`sections.${section.id}.name`)}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45">
                    {tJourney(`sections.${section.id}.location`)}
                  </span>
                </span>
                <span
                  className={`pointer-events-none absolute right-1 grid h-6 w-6 place-items-center rounded-full transition-all duration-300 ${
                    isActive
                      ? 'scale-110 bg-gold/15'
                      : 'bg-transparent group-hover:bg-paper/5'
                  }`}
                >
                  <Motif
                    variant="sun"
                    className={`h-3.5 w-3.5 transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-paper/25 group-hover:text-paper/60'
                    }`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
