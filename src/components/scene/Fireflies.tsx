import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeParticles(count: number) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 6,
    y: Math.random() * 2 + 0.5,
    z: (Math.random() - 0.5) * 25 - 10,
    speed: Math.random() * 0.5 + 0.1,
    offset: Math.random() * Math.PI * 2,
  }));
}

export default function Fireflies({ count = 50 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useRef(new THREE.Object3D()).current;

  // Lazy initializer: impure Math.random runs once, not on re-renders.
  const [particles] = useState(() => makeParticles(count));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.elapsedTime;
    
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(time * p.speed + p.offset) * 0.5,
        p.y + Math.cos(time * p.speed * 0.8 + p.offset) * 0.5,
        p.z + Math.sin(time * p.speed * 1.2 + p.offset) * 0.5
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#E8A93A" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}
