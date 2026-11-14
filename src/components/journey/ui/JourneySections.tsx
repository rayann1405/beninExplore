'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '@/lib/data/journey';
import { useJourneyScroll, prefersReducedMotion } from '../scroll/useJourneyScroll';
import SectionPanel from './SectionPanel';

gsap.registerPlugin(ScrollTrigger);

// Sections DOM empilées qui pilotent la longueur du scroll : une par entrée de
// `journey`, 100vh chacune. C'est elles que GSAP ScrollTrigger fait défiler.
//
// Cartes coulissantes : chaque carte traverse la section de droite à gauche au
// fil du scroll (scrub lié à la section) — le monument actif est centré (x=0),
// puis sort vers la gauche pendant que la suivante entre par la droite.
// prefers-reduced-motion : cartes statiques.
export default function JourneySections() {
  useJourneyScroll();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'));
    const tweens = cards.map((card) =>
      gsap.fromTo(
        card,
        { x: 160, opacity: 0.25 },
        {
          x: -160,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card.closest('[data-section]') ?? card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )
    );
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <div data-journey-scroll className="pointer-events-none relative z-10">
      {journey.map((section, i) => (
        <section
          key={section.id}
          data-section={i}
          className={`pointer-events-none flex h-screen items-center px-6 md:px-16 ${
            i % 2 === 0 ? 'justify-start' : 'justify-end'
          }`}
        >
          <div data-panel className="will-change-transform">
            <SectionPanel section={section} index={i} total={journey.length} />
          </div>
        </section>
      ))}
    </div>
  );
}
