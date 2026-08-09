'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import type { JourneyAsset } from '@/lib/data/journey';
import { setSectionHeight } from './scroll/sectionHeights';
import '@/lib/three/gltf';

interface AssetModelProps {
  asset: JourneyAsset;
  index: number;
  position: [number, number, number];
  accent: string;
}

// Charge un scan photogrammétrique (GLB DRACO), le place au sol quel que soit
// son origine (autoground via la bounding box) et l'habille d'un halo lumineux
// à la couleur de la palette de la section. La hauteur réelle mesurée est
// reportée au cadrage caméra (sectionHeights).
export default function AssetModel({ asset, index, position, accent }: AssetModelProps) {
  const { scene } = useGLTF(asset.url, true);
  const groupRef = useRef<THREE.Group>(null);
  const [offsetY, setOffsetY] = useState(0);
  const scale = asset.scale ?? 1;
  const rotationY = asset.rotationY ?? 0;

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(groupRef.current);
    setOffsetY(-box.min.y);
    setSectionHeight(index, box.max.y - box.min.y);
  }, [scene, scale, rotationY, index]);

  return (
    <group position={position}>
      <group ref={groupRef} position={[0, offsetY, 0]} scale={scale} rotation={[0, rotationY, 0]}>
        <primitive object={scene} />
      </group>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 3, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}
