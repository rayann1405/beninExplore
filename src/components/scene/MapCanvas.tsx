'use client';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import MapScene from './MapScene';
import ScrollProgressSync from './ScrollProgressSync';
import { journeyOrder } from '@/lib/data/journeyOrder';

// pages = intro + stops + outro; each page is one viewport of scroll.
const PAGES = journeyOrder.length + 2;

export default function MapCanvas() {
  return (
    <Canvas
      camera={{ position: [-1, 4.5, -16], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#0B1A2B']} />
      {/* Fog starts past the stops' resting distance and clears before the
          country-wide intro vantage, so the whole silhouette reads. */}
      <fog attach="fog" args={['#0B1A2B', 20, 55]} />

      <ScrollControls pages={PAGES} damping={0.12}>
        <Suspense fallback={null}>
          <MapScene />
        </Suspense>
        <ScrollProgressSync />
      </ScrollControls>
    </Canvas>
  );
}
