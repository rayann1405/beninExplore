import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PointOfInterestBase } from '@/lib/data/poi';
import { categoryConfig } from '@/lib/categories';
import { getTerrainHeight } from './terrainNoise';

export default function Marker({
  poi,
  isFaded,
  isActive,
}: {
  poi: PointOfInterestBase;
  isFaded: boolean;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const y = getTerrainHeight(poi.coords.x, poi.coords.y) + 0.5;
  const position = new THREE.Vector3(poi.coords.x, y, -poi.coords.y);
  const color = new THREE.Color(categoryConfig[poi.category].color);

  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      const time = clock.elapsedTime;

      // Floating animation
      meshRef.current.position.y = position.y + Math.sin(time * 2 + poi.coords.x) * 0.1;
      glowRef.current.position.y = meshRef.current.position.y;

      // Pulsation glow, boosted while this is the stop the journey is
      // currently passing.
      const pulse = Math.sin(time * 3 + poi.coords.y) * 0.2 + 0.8;
      const scale = isActive ? 1.6 : 1.0;

      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      glowRef.current.scale.lerp(new THREE.Vector3(scale * pulse * 1.5, scale * pulse * 1.5, scale * pulse * 1.5), 0.1);

      const opacity = isFaded ? 0.2 : isActive ? 1.0 : 0.8;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacity;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
    }
  });

  return (
    <group>
      {/* Inner core */}
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent={true}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
