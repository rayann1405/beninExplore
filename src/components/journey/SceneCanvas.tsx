'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ExpeditionScene from './ExpeditionScene';

// Canvas opaque plein écran. Le fond et le brouillard sont pilotés par
// SceneAtmosphere (crossfade de palette lié au scroll), la caméra par
// JourneyCamera (trajectoire dérivée de `journey.length`).
export default function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 6, 12], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false }}
    >
      <Suspense fallback={null}>
        <ExpeditionScene />
      </Suspense>
    </Canvas>
  );
}
