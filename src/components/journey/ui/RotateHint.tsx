'use client';
import { useCallback, useEffect, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useJourneyStore } from '@/lib/store';
import { journey } from '@/lib/data/journey';

// Indice discret « Faites glisser pour pivoter », visible uniquement quand la
// section active présente un modèle 3D (asset défini) — jamais sur les sections
// en décor par défaut. Disparaît au premier glissement et après quelques secondes.
function HintPill({ onFirstPointer }: { onFirstPointer: () => void }) {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', onFirstPointer);
    return () => window.removeEventListener('pointerdown', onFirstPointer);
  }, [onFirstPointer]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-2.5 border border-flag-yellow/25 bg-ink/70 px-4 py-2 backdrop-blur">
        <MoveHorizontal size={14} className="text-flag-yellow" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/80">
          {t('rotateHint')}
        </span>
      </div>
    </div>
  );
}

export default function RotateHint() {
  const active = useJourneyStore((s) => s.activeSectionIndex);
  const section = journey[active];
  const hasAsset = !!section?.asset;
  const [hidden, setHidden] = useState(false);
  const onFirstPointer = useCallback(() => setHidden(true), []);

  if (!hasAsset || hidden) return null;

  // `key` remonte le montage du pilule à chaque nouvelle section : l'indice
  // réapparaît pour chaque monument, sans setState synchrone dans un effet.
  return <HintPill key={section.id} onFirstPointer={onFirstPointer} />;
}
