'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
  loading: () => <Loader />,
});

function Loader() {
  const t = useTranslations('common');
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-laterite border-t-transparent" />
        <p className="font-mono uppercase tracking-widest text-paper">{t('loading')}</p>
      </div>
    </div>
  );
}

function NoWebGL() {
  const t = useTranslations('common');
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background via-ink to-background">
      <p className="rounded-full border border-paper/10 bg-ink/90 px-4 py-2 font-mono text-xs text-paper/70">
        {t('noWebGL')}
      </p>
    </div>
  );
}

// Scène 3D fixe plein écran en arrière-plan (sous les sections DOM). Vérifie
// la disponibilité de WebGL après montage et replie vers un message statique.
export default function ExpeditionCanvas() {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        const ok = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        );
        setWebgl(ok);
      } catch {
        setWebgl(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {webgl === false ? <NoWebGL /> : <SceneCanvas />}
    </div>
  );
}
