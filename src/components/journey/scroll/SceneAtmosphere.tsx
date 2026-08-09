'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { journey } from '@/lib/data/journey';
import { paletteFor } from '../decor/palette';
import { journeyProgress } from './useJourneyScroll';

// Fait suivre le fond, le brouillard et la lumière ambiante à la position
// continue de la caméra : crossfade en douceur entre les palettes des
// sections voisines, lié au scroll (aucun saut de couleur).
export default function SceneAtmosphere() {
  const background = useRef<THREE.Color>(new THREE.Color());
  const fog = useRef<THREE.Fog>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const lerpB = useRef<THREE.Color>(new THREE.Color());
  const fogArgs = useMemo(() => [new THREE.Color(0x000000), 18, 42] as const, []);

  useFrame(() => {
    const t = journeyProgress.t;
    const last = journey.length - 1;
    const i = Math.min(Math.max(Math.floor(t), 0), last);
    const f = Math.min(Math.max(t - i, 0), 1);
    const a = paletteFor(journey[i].palette);
    const b = paletteFor(journey[Math.min(i + 1, last)].palette);

    background.current.set(a.background).lerp(lerpB.current.set(b.background), f);
    if (fog.current) fog.current.color.set(a.fog).lerp(lerpB.current.set(b.fog), f);
    if (ambient.current) ambient.current.color.set(a.light).lerp(lerpB.current.set(b.light), f);
  });

  return (
    <>
      <color attach="background" args={['#000000']} ref={background} />
      <fog ref={fog} attach="fog" args={fogArgs} />
      <ambientLight ref={ambient} intensity={0.6} />
    </>
  );
}
