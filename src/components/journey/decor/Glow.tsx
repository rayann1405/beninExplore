'use client';
import { useState } from 'react';
import * as THREE from 'three';

function makeTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.38)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// Halo radial additif : nappe de lumière chaude posée derrière le modèle, à la
// couleur de la palette du lieu. Un sprite (toujours face caméra) — atmosphère
// cinématique sans toucher à la géométrie ni au matériau du scan.
export default function Glow({
  color,
  position,
  scale = [11, 8, 1],
  opacity = 0.28,
}: {
  color: string;
  position: [number, number, number];
  scale?: [number, number, number];
  opacity?: number;
}) {
  const [texture] = useState(() => makeTexture());

  return (
    <sprite position={position} scale={scale}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}
