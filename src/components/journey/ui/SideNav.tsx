'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';
import { prefersReducedMotion } from '../scroll/useJourneyScroll';

// Menu latéral fixe : une pastille par étape, active mise en évidence. Clic =
// défilement fluide vers la section (direct avec prefers-reduced-motion).
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
      className="fixed right-5 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3"
    >
      {journey.map((section, i) => (
        <button
          key={section.id}
          type="button"
          onClick={() => go(i)}
          aria-label={section.name}
          aria-current={i === active}
          title={section.name}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            i === active ? 'scale-125 bg-gold' : 'bg-paper/30 hover:bg-paper/60'
          }`}
        />
      ))}
    </nav>
  );
}
