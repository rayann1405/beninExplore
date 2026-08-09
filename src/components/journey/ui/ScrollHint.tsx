'use client';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useJourneyStore } from '@/lib/store';

// Invitation à défiler, visible uniquement sur la première étape.
export default function ScrollHint() {
  const t = useTranslations('common');
  const active = useJourneyStore((s) => s.activeSectionIndex);
  if (active > 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-paper/60">
        {t('scrollHint')}
      </span>
      <ChevronDown size={16} className="text-gold motion-safe:animate-bounce" />
    </div>
  );
}
