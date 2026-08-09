'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { JourneySection } from '@/lib/data/journey';
import type { Palette } from './palette';
import Particles from './Particles';

interface DefaultSceneProps {
  section: JourneySection;
  palette: Palette;
  position: [number, number, number];
}

// Ambiance de décor pour une section sans modèle 3D : jamais de vide ni de
// placeholder flottant. Registre différencié — monument : totem sobre ;
// événement : arène lumineuse (weloveya = palette fete, vive et colorée ;
// vodun-days = nuit-indigo posée, jamais folklorisée). Halo au sol + lumière
// d'accent + particules, tout dérivé de la palette.
export default function DefaultScene({ section, palette, position }: DefaultSceneProps) {
  const glow = useRef<THREE.PointLight>(null);
  const core = useRef<THREE.Mesh>(null);
  const isEvent = section.type === 'evenement';

  useFrame(({ clock }) => {
    if (!core.current || !glow.current) return;
    const t = clock.elapsedTime * palette.particleSpeed;
    core.current.rotation.y = t * 0.15;
    glow.current.intensity = 30 + Math.sin(t * 2) * 8;
  });

  return (
    <group position={position}>
      {/* halo au sol */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 3, 48]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* totem (monument) ou arène (événement) */}
      <mesh ref={core} position={[0, 1.4, 0]}>
        {isEvent ? (
          <cylinderGeometry args={[2.4, 2.4, 0.5, 32]} />
        ) : (
          <coneGeometry args={[1.1, 2.8, 5]} />
        )}
        <meshStandardMaterial
          color="#0A0A14"
          emissive={palette.accent}
          emissiveIntensity={isEvent ? 0.8 : 0.55}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {isEvent && (
        <mesh position={[0, 1.7, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.3, 24]} />
          <meshStandardMaterial
            color="#0A0A14"
            emissive={palette.accent}
            emissiveIntensity={0.9}
          />
        </mesh>
      )}

      <pointLight ref={glow} position={[0, 4, 1.5]} color={palette.accent} intensity={30} distance={14} />
      <Particles palette={palette} position={[0, 2, 0]} radius={5} />
    </group>
  );
}
