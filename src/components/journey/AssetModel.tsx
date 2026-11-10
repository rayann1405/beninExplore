'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { JourneyAsset } from '@/lib/data/journey';
import { setSectionHeight } from './scroll/sectionHeights';
import {
  AUTO_ROTATE_SPEED,
  IDLE_RESUME_MS,
  modelInteraction,
} from './scroll/modelInteraction';
import { prefersReducedMotion } from './scroll/useJourneyScroll';
import '@/lib/three/gltf';

interface AssetModelProps {
  asset: JourneyAsset;
  index: number;
  position: [number, number, number];
  accent: string;
}

// Charge un scan photogrammétrique (GLB DRACO), le place au sol quel que soit
// son origine (autoground via la bounding box) et le baigne dans un halo
// lumineux à la couleur de la palette. Le matériau PBR d'origine du scan est
// conservé — c'est l'éclairage (ExpeditionScene) qui sculpte la matière.
//
// Rotation : l'utilisateur peut pivoter le modèle sur son axe Y au pointeur
// (SceneCanvas écrit modelInteraction.manual). Au repos, une lente
// rotation automatique reprend (sauf prefers-reduced-motion) ; elle s'interrompt
// dès qu'on touche au modèle et reprend après quelques secondes d'inactivité.
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

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const now = performance.now();
    if (!prefersReducedMotion && !modelInteraction.dragging && now - modelInteraction.lastInteractAt > IDLE_RESUME_MS) {
      const auto = modelInteraction.auto.get(index) ?? 0;
      modelInteraction.auto.set(index, auto + delta * AUTO_ROTATE_SPEED);
    }
    const manual = modelInteraction.manual.get(index) ?? 0;
    const auto = modelInteraction.auto.get(index) ?? 0;
    g.rotation.y = rotationY + manual + auto;
  });

  return (
    <group position={position}>
      <group ref={groupRef} position={[0, offsetY, 0]} scale={scale}>
        <primitive object={scene} />
      </group>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 3, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}
