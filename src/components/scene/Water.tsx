import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAKE_NOKOUE } from '@/lib/data/mapScale';

// Ocean plane plus Lake Nokoué (the coastal depression carved in
// terrainNoise). Both are simple animated dark surfaces — the stylized
// counterpart to the terrain's PBR textures.
export default function Water() {
  const oceanRef = useRef<THREE.Mesh>(null);
  const lakeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (oceanRef.current) {
      oceanRef.current.position.y = Math.sin(t * 0.5) * 0.08 - 0.28;
    }
    if (lakeRef.current) {
      lakeRef.current.position.y = Math.sin(t * 0.7 + 1.4) * 0.06 - 0.24;
    }
  });

  return (
    <group>
      {/* Ocean — large enough to fill the horizon behind the coast. */}
      <mesh ref={oceanRef} position={[0, -0.28, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60, 64, 64]} />
        <meshStandardMaterial color="#08131F" roughness={0.15} metalness={0.7} transparent opacity={0.95} />
      </mesh>

      {/* Lake Nokoué — ellipse on the depression near Cotonou / Ganvié. */}
      <mesh
        ref={lakeRef}
        position={[LAKE_NOKOUE.x, -0.24, -LAKE_NOKOUE.y]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, 1, 0.78]}
      >
        <circleGeometry args={[1.12, 48]} />
        <meshStandardMaterial color="#0A1E2E" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
}
