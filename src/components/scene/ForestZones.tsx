'use client';
import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { forestZones, ForestZone } from '@/lib/data/poi';
import { getTerrainHeight } from './terrainNoise';
import { useGltfAsset } from './useGltfAsset';

const STYLE_ASSET: Record<ForestZone['style'], string> = {
  sacree: '/modele/tier3/canopee.glb',
  savane: '/modele/tier3/arbre.glb',
  palmeraie: '/modele/tier3/palmier.glb',
};

const STYLE_SCALE: Record<ForestZone['style'], number> = {
  sacree: 1.4,
  savane: 1.0,
  palmeraie: 1.15,
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Placement {
  x: number;
  y: number;
  rot: number;
  scale: number;
}

function generatePlacements(zone: ForestZone): Placement[] {
  const rng = mulberry32(
    zone.id.split('').reduce((s, c) => s + c.charCodeAt(0) * 11, 29) * 97
  );
  const out: Placement[] = [];

  if (zone.band && zone.bandPoints) {
    const pts = zone.bandPoints;
    for (let i = 0; i < zone.density; i++) {
      // Position along the band polyline, nudged inland (away from the sea).
      const segs = pts.length - 1;
      const seg = Math.floor(rng() * segs);
      const t = rng();
      const a = pts[seg];
      const b = pts[seg + 1];
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const inland = 0.06 + rng() * 0.28;
      // Nudge the palms north of the coastline band so they sit just above
      // the waterline instead of splashing into it.
      const py = y + Math.abs(dx / len) * inland;
      out.push({ x, y: py, rot: rng() * Math.PI * 2, scale: 0.8 + rng() * 0.4 });
    }
    return out;
  }

  const center = zone.center ?? { x: 0, y: 0 };
  const radius = zone.radius ?? 0.5;
  const tightness = zone.style === 'sacree' ? 0.35 : 0.85; // dense sacred grove vs open savanna
  for (let i = 0; i < zone.density; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = Math.pow(rng(), tightness) * radius;
    const x = center.x + Math.cos(angle) * dist;
    const y = center.y + Math.sin(angle) * dist;
    out.push({ x, y, rot: rng() * Math.PI * 2, scale: 0.7 + rng() * 0.7 });
  }
  return out;
}

function ForestZoneMesh({ zone }: { zone: ForestZone }) {
  const asset = useGltfAsset(STYLE_ASSET[zone.style]);
  const placements = useMemo(() => generatePlacements(zone), [zone]);
  const baseScale = STYLE_SCALE[zone.style];

  if (!asset) return null;
  return (
    <Instances
      limit={placements.length}
      geometry={asset.geometry}
      material={asset.material}
      castShadow
      receiveShadow
    >
      {placements.map((p, i) => (
        <Instance
          key={i}
          position={[p.x, getTerrainHeight(p.x, p.y), -p.y]}
          rotation={[0, p.rot, 0]}
          scale={p.scale * baseScale}
        />
      ))}
    </Instances>
  );
}

export default function ForestZones() {
  return (
    <group>
      {forestZones.map((zone) => (
        <ForestZoneMesh key={zone.id} zone={zone} />
      ))}
    </group>
  );
}
