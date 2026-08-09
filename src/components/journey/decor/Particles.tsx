'use client';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Palette } from './palette';
import { prefersReducedMotion } from '../scroll/useJourneyScroll';

interface ParticlesProps {
  palette: Palette;
  position?: [number, number, number];
  radius?: number;
}

function makeGeometry(palette: Palette, radius: number) {
  const count = prefersReducedMotion ? Math.floor(palette.particleCount / 4) : palette.particleCount;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c1 = new THREE.Color(palette.particle);
  const c2 = new THREE.Color(palette.particleAlt ?? palette.particle);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * radius * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * radius;
    const col = Math.random() < 0.75 ? c1 : c2;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

// Champ de particules paramétré par la palette (couleur, densité, vitesse).
// prefers-reduced-motion : particules fortement réduites et statiques.
export default function Particles({ palette, position = [0, 0, 0], radius = 7 }: ParticlesProps) {
  const points = useRef<THREE.Points>(null);
  const [geometry] = useState(() => makeGeometry(palette, radius));

  useFrame(({ clock }) => {
    if (!points.current || prefersReducedMotion) return;
    const t = clock.elapsedTime * palette.particleSpeed;
    points.current.rotation.y = t * 0.02;
    points.current.rotation.x = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <points ref={points} position={position} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
