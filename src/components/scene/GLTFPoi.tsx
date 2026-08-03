'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PointOfInterestBase } from '@/lib/data/poi';
import { useMapStore } from '@/lib/store';
import { getTerrainHeight } from './terrainNoise';
import { useGltfAsset } from './useGltfAsset';

// Renders a tier-1 monument from a real GLB (photogrammetry scan). The
// scan's scale is not metric by default, so `asset.scale` (tuned per model)
// and `asset.rotationY` come from the data. The model is auto-grounded: its
// bounding box bottom is placed on the terrain, whatever the scan's origin.
export default function GLTFPoi({ poi }: { poi: PointOfInterestBase }) {
  const asset = useGltfAsset(poi.asset.url);
  const scene = asset?.scene ?? null;
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [posY, setPosY] = useState(0);

  const isActive = useMapStore((s) => s.activePoiIndex) === poi.pathOrder - 1;
  const setSelectedPoiId = useMapStore((s) => s.setSelectedPoiId);

  const scale = poi.asset.scale ?? 1;
  const rotationY = poi.asset.rotationY ?? 0;
  const ground = getTerrainHeight(poi.coords.x, poi.coords.y);

  useLayoutEffect(() => {
    if (!groupRef.current || !scene) return;
    groupRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(groupRef.current);
    setPosY(ground - box.min.y);
  }, [scene, scale, ground]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const t = clock.elapsedTime;
      const pulse = 0.5 + Math.sin(t * 2 + poi.coords.x) * 0.25;
      glowRef.current.scale.setScalar(isActive ? 1.5 + pulse * 0.5 : 1 + pulse * 0.3);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.4 : 0.18;
    }
  });

  return (
    <group position={[poi.coords.x, posY, -poi.coords.y]}>
      <group
        ref={groupRef}
        scale={scale}
        rotation={[0, rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPoiId(poi.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {scene ? <primitive object={scene} /> : null}
      </group>

      {/* Ground halo */}
      <mesh ref={glowRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.9, 32]} />
        <meshBasicMaterial
          color={isActive ? '#E86A34' : '#E8A93A'}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
