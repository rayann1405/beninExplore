'use client';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';
import NoWebGLFallback from './NoWebGLFallback';
import { useEffect, useState } from 'react';

const MapCanvas = dynamic(() => import('../scene/MapCanvas'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// Fixed full-viewport background layer: the 3D journey, or a static
// fallback if WebGL isn't available. The journey's overlay content (in
// JourneyOverlay) lives outside this component and renders regardless, so
// there's nothing else this needs to gate.
export default function MapHero() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) setHasWebGL(false);
      } catch {
        setHasWebGL(false);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {hasWebGL ? <MapCanvas /> : <NoWebGLFallback />}
    </div>
  );
}
