'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { PointOfInterestBase } from '@/lib/data/poi';
import { categoryConfig } from '@/lib/categories';
import { getTerrainHeight } from './terrainNoise';
import { buildLocalTerrainPatch } from './localTerrain';
import { createTerrainMaterial, NATIONAL_NORTH_EXTENT } from './Terrain';

function MiniTerrain({ poi }: { poi: PointOfInterestBase }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = categoryConfig[poi.category].color;

  const geometry = useMemo(
    () => buildLocalTerrainPatch(poi.coords.x, poi.coords.y),
    [poi.coords.x, poi.coords.y]
  );
  const material = useMemo(
    () => createTerrainMaterial(NATIONAL_NORTH_EXTENT, poi.coords.y),
    [poi.coords.y]
  );
  const markerHeight = useMemo(
    () => getTerrainHeight(poi.coords.x, poi.coords.y),
    [poi.coords.x, poi.coords.y]
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh receiveShadow castShadow geometry={geometry} material={material} />

      {/* Decorative marker for the place itself, sitting on its own relief */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, markerHeight + 0.6, 0]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Glow */}
      <mesh position={[0, markerHeight + 0.6, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function PlaceScene({ poi }: { poi: PointOfInterestBase }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 45 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#061019']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#F2EDE1" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color={categoryConfig[poi.category].color} />
      
      <MiniTerrain poi={poi} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.1}
      />
      <Environment preset="night" />
    </Canvas>
  );
}
