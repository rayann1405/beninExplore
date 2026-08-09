'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sampleJourney } from './computeCamera';
import { journeyProgress, prefersReducedMotion } from './useJourneyScroll';

// Positionne la caméra chaque frame le long de la trajectoire dérivée de
// `journey.length`. En mouvement : travelling amorti (interpolation douce,
// pas de saut). Avec prefers-reduced-motion : transition directe sur la cible
// de la section active (t arrondi, aucun amortissement).
export default function JourneyCamera() {
  const position = useRef(new THREE.Vector3()).current;
  const lookAt = useRef(new THREE.Vector3()).current;

  useFrame(({ camera }, delta) => {
    const t = prefersReducedMotion ? Math.round(journeyProgress.t) : journeyProgress.t;
    const sample = sampleJourney(t);
    const target = position.set(sample.position[0], sample.position[1], sample.position[2]);
    const targetLook = lookAt.set(sample.lookAt[0], sample.lookAt[1], sample.lookAt[2]);

    if (prefersReducedMotion) {
      camera.position.copy(target);
    } else {
      const d = 1 - Math.exp(-4 * delta);
      camera.position.lerp(target, d);
    }

    camera.lookAt(targetLook);
  });

  return null;
}
