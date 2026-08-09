'use client';
import { journey } from '@/lib/data/journey';
import { useJourneyScroll } from '../scroll/useJourneyScroll';
import SectionPanel from './SectionPanel';

// Sections DOM empilées qui pilotent la longueur du scroll : une par entrée de
// `journey`, 100vh chacune. C'est elles que GSAP ScrollTrigger fait défiler.
export default function JourneySections() {
  useJourneyScroll();

  return (
    <div data-journey-scroll className="relative z-10">
      {journey.map((section, i) => (
        <section
          key={section.id}
          data-section={i}
          className={`flex h-screen items-center px-6 md:px-16 ${
            i % 2 === 0 ? 'justify-start' : 'justify-end'
          }`}
        >
          <SectionPanel section={section} index={i} total={journey.length} />
        </section>
      ))}
    </div>
  );
}
