'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';
import { prefersReducedMotion } from '../scroll/useJourneyScroll';

// Menu latéral fixe : fil vertical, un losange numéroté par étape, actif en
// bronze. Clic = défilement fluide vers la section (direct si reduced-motion).
export default function SideNav() {
  const active = useJourneyStore((s) => s.activeSectionIndex);

  const go = (index: number) => {
    document
      .querySelector(`[data-section="${index}"]`)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Étapes du parcours"
      className="fixed right-5 top-1/2 z-40 -translate-y-1/2 md:right-8"
    >
      <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-paper/10" />
      <ul className="flex flex-col">
        {journey.map((section, i) => {
          const isActive = i === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={section.name}
                aria-current={isActive}
                className="group relative flex h-9 w-8 items-center justify-center"
              >
                <span
                  className={`pointer-events-none absolute right-11 hidden items-center gap-2 whitespace-nowrap rounded-sm border border-gold/20 bg-ink/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80 backdrop-blur transition-all duration-200 group-hover:opacity-100 md:flex ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="text-gold">{String(i + 1).padStart(2, '0')}</span>
                  {section.name}
                </span>
                <span
                  className={`absolute right-1 inline-block h-2.5 w-2.5 rotate-45 transition-all duration-300 ${
                    isActive
                      ? 'bg-gold shadow-[0_0_10px_rgba(224,168,62,0.7)]'
                      : 'bg-paper/20 group-hover:bg-paper/50'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
