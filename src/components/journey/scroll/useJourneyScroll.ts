'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '@/lib/data/journey';
import { useJourneyStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

// Proxy mutable partagé : lu par la caméra à chaque frame sans re-render React.
// Écrit par ScrollTrigger (scrub), maintenu dans la plage [0, journey.length - 1].
export const journeyProgress = { t: 0 };

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Relie le scroll natif du conteneur [data-journey-scroll] à la progression du
// parcours. Chaque 100vh de scroll traverse une section.
export function useJourneyScroll() {
  const setActiveSectionIndex = useJourneyStore((s) => s.setActiveSectionIndex);
  const lastIndex = useRef(-1);

  useEffect(() => {
    const proxy = { t: 0 };
    journeyProgress.t = 0;

    const update = () => {
      journeyProgress.t = proxy.t;
      const index = Math.round(proxy.t);
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        setActiveSectionIndex(index);
      }
    };

    const tween = gsap.to(proxy, {
      t: journey.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.querySelector('[data-journey-scroll]'),
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: update,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [setActiveSectionIndex]);
}
