'use client';
import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { poiData, PointOfInterestBase } from '@/lib/data/poi';
import { useMapStore } from '@/lib/store';
import { getTerrainHeight } from './terrainNoise';
import { useGltfAsset } from './useGltfAsset';
import GLTFPoi from './GLTFPoi';
import ModelPlaceholder from './ModelPlaceholder';

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

// Instanced cluster for tier-2 (villages) and tier-3 (vegetation) POIs:
// `asset.instances` copies around the stop with light random rotation/scale
// so repetition never reads as visible clones.
function InstancedCluster({ poi }: { poi: PointOfInterestBase }) {
  const asset = useGltfAsset(poi.asset.url);
  const setSelectedPoiId = useMapStore((s) => s.setSelectedPoiId);
  const count = poi.asset.instances ?? 1;

  const placements = useMemo(() => {
    const rng = mulberry32(
      poi.id.split('').reduce((s, c) => s + c.charCodeAt(0) * 7, 13) * 131
    );
    const list: { x: number; y: number; rot: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = Math.sqrt(rng()) * 0.45;
      const lx = poi.coords.x + Math.cos(angle) * dist;
      const ly = poi.coords.y + Math.sin(angle) * dist;
      list.push({
        x: lx,
        y: ly,
        rot: rng() * Math.PI * 2,
        scale: (poi.asset.scale ?? 1) * (0.8 + rng() * 0.45),
      });
    }
    return list;
  }, [poi, count]);

  if (!asset) return null;

  return (
    <Instances
      limit={count}
      geometry={asset.geometry}
      material={asset.material}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPoiId(poi.id);
      }}
    >
      {placements.map((p, i) => (
        <Instance
          key={i}
          position={[p.x, getTerrainHeight(p.x, p.y), -p.y]}
          rotation={[0, p.rot, 0]}
          scale={p.scale}
        />
      ))}
    </Instances>
  );
}

export default function PoiModels() {
  const { selectedCategory } = useMapStore();

  return (
    <group>
      {poiData.map((poi) => {
        const isFaded = selectedCategory !== null && selectedCategory !== poi.category;
        if (isFaded) return null;
        if (poi.asset.tier === 1) {
          // Only real scans render as models; anything else is a placeholder.
          const exists = poi.asset.url.includes('.opt.glb');
          return exists ? (
            <GLTFPoi key={poi.id} poi={poi} />
          ) : (
            <ModelPlaceholder key={poi.id} poi={poi} />
          );
        }
        return <InstancedCluster key={poi.id} poi={poi} />;
      })}
    </group>
  );
}
