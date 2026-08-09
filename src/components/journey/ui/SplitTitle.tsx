'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../scroll/useJourneyScroll';

gsap.registerPlugin(ScrollTrigger);

// Titre animé lettre par lettre à l'entrée de la section (split manuel en
// <span>, stagger GSAP — pas de plugin SplitText). prefers-reduced-motion :
// apparition directe, sans animation.
export default function SplitTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const chars = Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-char]'));
    if (prefersReducedMotion) {
      gsap.set(spans, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(spans, { opacity: 0, yPercent: 110 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(spans, {
          opacity: 1,
          yPercent: 0,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.035,
        });
      },
    });
    return () => trigger.kill();
  }, [text]);

  return (
    <h2 ref={ref} className={className}>
      {chars.map((char, i) => (
        <span key={i} data-char className="inline-block overflow-hidden align-top">
          <span className="inline-block will-change-transform">
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </h2>
  );
}
