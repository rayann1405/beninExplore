'use client';
import { useTranslations } from 'next-intl';

// Static stand-in for the 3D journey when WebGL isn't available. The
// journey's overlay content (JourneyOverlay) is unaffected — it's plain HTML
// and renders regardless — so this only needs to fill the background.
export default function NoWebGLFallback() {
  const t = useTranslations('common');

  return (
    <div className="absolute inset-0 bg-linear-to-b from-background via-ink to-background">
      <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-ink/90 border border-paper/10 rounded-full px-4 py-2">
        <p className="text-paper/70 text-xs font-mono">{t('noWebGL')}</p>
      </div>
    </div>
  );
}
