'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollExpandMedia from '@/components/blocks/ScrollExpandMedia';
import Motif from '@/components/journey/ui/Motif';

// Page de présentation du projet, non-localisée : hero image béninoise qui
// s'agrandit au scroll (ScrollExpandMedia), puis bouton « Commencer » qui
// demande la langue d'exploration — FR ou EN → redirection vers /fr ou /en
// (le parcours). Le choix de langue EST le sélecteur de locale (pas de navbar).
export default function Landing() {
  const router = useRouter();
  const [choosing, setChoosing] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const choose = (locale: 'fr' | 'en') => {
    setLeaving(true);
    setTimeout(() => router.push(`/${locale}`), 350);
  };

  return (
    <main
      className={`min-h-dvh bg-background text-paper transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/statue_amazone.jpg"
        bgImageSrc="/images/palais_abomey..png"
        title="Bénin Explore"
        date="Patrimoine · Culture · Histoire"
        scrollToExpand="Faites défiler pour révéler"
      >
        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
          <span aria-hidden className="flag-band h-[3px] w-40" />
          <Motif variant="emblem" className="mt-8 w-20 text-gold" />
          <h1 className="mt-6 font-display text-4xl font-semibold text-paper md:text-6xl">
            Bénin <span className="text-gold">Explore</span>
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-paper/70">
            Un parcours immersif à travers le patrimoine béninois
          </p>

          {!choosing ? (
            <button
              type="button"
              onClick={() => setChoosing(true)}
              className="mt-10 cursor-pointer bg-flag-yellow px-10 py-4 font-mono text-sm font-semibold uppercase tracking-[0.3em] text-ink transition-colors duration-300 hover:bg-gold"
            >
              Commencer
            </button>
          ) : (
            <div className="mt-10 flex w-full max-w-md flex-col gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/60">
                Dans quelle langue ?
              </p>
              <button
                type="button"
                onClick={() => choose('fr')}
                className="flex cursor-pointer items-center justify-between border border-flag-green/50 bg-ink/70 px-6 py-4 font-sans text-lg text-paper transition-colors duration-300 hover:bg-flag-green/15"
              >
                <span className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-flag-green" />
                  Français
                </span>
                <span className="font-mono text-xs tracking-[0.2em] text-paper/50">FR</span>
              </button>
              <button
                type="button"
                onClick={() => choose('en')}
                className="flex cursor-pointer items-center justify-between border border-flag-red/50 bg-ink/70 px-6 py-4 font-sans text-lg text-paper transition-colors duration-300 hover:bg-flag-red/15"
              >
                <span className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-flag-red" />
                  English
                </span>
                <span className="font-mono text-xs tracking-[0.2em] text-paper/50">EN</span>
              </button>
            </div>
          )}
        </div>
      </ScrollExpandMedia>
    </main>
  );
}
