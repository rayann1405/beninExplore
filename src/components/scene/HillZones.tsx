'use client';
import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { hillZones, HillZone } from '@/lib/data/poi';
import { getTerrainHeight } from './terrainNoise';
import { useGltfAsset } from './useGltfAsset';

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

// Scatters tier-3 rocks over the two HillZones for foreground detail on top
// of the relief boost already applied in terrainNoise.ts.
function HillZoneMesh({ zone }: { zone: HillZone }) {
  const asset = useGltfAsset('/modele/tier3/rocher.glb');
  const count = zone.rockPropsCount ?? 20;

  const placements = useMemo(() => {
    const rng = mulberry32(
      zone.id.split('').reduce((s, c) => s + c.charCodeAt(0) * 13, 41) * 137
    );
    const list: { x: number; y: number; rot: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = Math.pow(rng(), 0.8) * zone.radius;
      list.push({
        x: zone.center.x + Math.cos(angle) * dist,
        y: zone.center.y + Math.sin(angle) * dist,
        rot: rng() * Math.PI * 2,
        scale:
          zone.style === 'granite'
            ? 0.25 + rng() * 0.4
            : 0.4 + rng() * 0.7,
      });
    }
    return list;
  }, [zone, count]);

  if (!asset) return null;
  return (
    <Instances
      limit={count}
      geometry={asset.geometry}
      material={asset.material}
      castShadow
      receiveShadow
    >
      {placements.map((p, i) => (
        <Instance
          key={i}
          position={[p.x, getTerrainHeight(p.x, p.y), -p.y]}
          rotation={[p.rot * 0.3, p.rot, 0]}
          scale={p.scale}
        />
      ))}
    </Instances>
  );
}

export default function HillZones() {
  return (
    <group>
      {hillZones.map((zone) => (
        <HillZoneMesh key={zone.id} zone={zone} />
      ))}
    </group>
  );
}
