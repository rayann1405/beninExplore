'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PointOfInterestBase } from '@/lib/data/poi';
import { getTerrainHeight } from './terrainNoise';

// Clearly identifiable placeholder for a tier-1 monument whose scan has not
// been delivered yet — never a generic statue that could pass for the real
// one. Replaced as soon as the client drops a GLB into /public/modele/tier1.
export default function ModelPlaceholder({ poi }: { poi: PointOfInterestBase }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ground = getTerrainHeight(poi.coords.x, poi.coords.y);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.4;
      meshRef.current.position.y =
        ground + 0.9 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[poi.coords.x, ground + 0.9, -poi.coords.y]}
      >
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#8FA6C7"
          wireframe
          transparent
          opacity={0.6}
          emissive="#8FA6C7"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Html position={[poi.coords.x, ground + 1.9, -poi.coords.y]} center distanceFactor={12}>
        <div className="pointer-events-none whitespace-nowrap rounded-full border border-paper/30 bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper/80">
          Modèle 3D à venir
        </div>
      </Html>
    </group>
  );
}
