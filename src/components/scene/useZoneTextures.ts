'use client';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

// Loads the four CC0 zone textures from /public/textures with a procedural
// fallback so the scene never breaks if a file is missing or the network
// was down when running `npm run textures:download`.
export interface ZoneTextures {
  laterite: THREE.Texture;
  savane: THREE.Texture;
  foret: THREE.Texture;
  sable: THREE.Texture;
}

const BASES: Record<keyof ZoneTextures, [number, number, number]> = {
  laterite: [193, 68, 14],
  savane: [232, 169, 58],
  foret: [47, 107, 79],
  sable: [216, 196, 154],
};

function makeProcedural(key: keyof ZoneTextures): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const [r, g, b] = BASES[key];
  const img = ctx.createImageData(size, size);
  let seed = key.split('').reduce((s, c) => s + c.charCodeAt(0) * 31, 7);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 46;
    img.data[i] = Math.max(0, Math.min(255, r + n));
    img.data[i + 1] = Math.max(0, Math.min(255, g + n));
    img.data[i + 2] = Math.max(0, Math.min(255, b + n));
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

async function loadWithFallback(key: keyof ZoneTextures): Promise<THREE.Texture> {
  const url = `/textures/${key}/color.jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('missing');
    const tex = await new THREE.TextureLoader().loadAsync(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  } catch {
    return makeProcedural(key);
  }
}

export function useZoneTextures(): ZoneTextures | null {
  const [textures, setTextures] = useState<ZoneTextures | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [laterite, savane, foret, sable] = await Promise.all([
        loadWithFallback('laterite'),
        loadWithFallback('savane'),
        loadWithFallback('foret'),
        loadWithFallback('sable'),
      ]);
      if (!cancelled) setTextures({ laterite, savane, foret, sable });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return textures;
}
