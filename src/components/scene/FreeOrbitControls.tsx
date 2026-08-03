'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMapStore } from '@/lib/store';
import { journeyOrder } from '@/lib/data/journeyOrder';
import { getTerrainHeight } from './terrainNoise';

const _flyPos = new THREE.Vector3();
const _flyLook = new THREE.Vector3();
const _flyTarget = new THREE.Vector3();
const _lookTarget = new THREE.Vector3(0, 1.2, -9);

type OrbitControlsRef = React.ComponentRef<typeof OrbitControls>;

// Free orbit mode: drag to orbit, wheel to zoom, click a model to fly the
// camera to its resting frame and open its panel.
export default function FreeOrbitControls() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsRef>(null);
  const flying = useRef(false);
  const flyStartPos = useRef(new THREE.Vector3());
  const flyStartLook = useRef(new THREE.Vector3());
  const flyTime = useRef(0);
  const lookTarget = useRef(_lookTarget.clone());

  const selectedPoiId = useMapStore((s) => s.selectedPoiId);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (!selectedPoiId) return;
    const index = journeyOrder.findIndex((p) => p.id === selectedPoiId);
    if (index < 0) return;
    const poi = journeyOrder[index];
    const ground = new THREE.Vector3(
      poi.coords.x,
      getTerrainHeight(poi.coords.x, poi.coords.y),
      -poi.coords.y
    );
    const [ox, oy, oz] = poi.camera.offset;
    const look = poi.camera.lookAtOffset ?? [0, 0.3, 0];
    _flyPos.copy(ground).add(new THREE.Vector3(ox, oy, oz));
    _flyLook.copy(ground).add(new THREE.Vector3(look[0], look[1], look[2]));
    _flyTarget.copy(ground);

    flyStartPos.current.copy(camera.position);
    flyStartLook.current.copy(lookTarget.current);
    flyTime.current = 0;
    flying.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [selectedPoiId, camera]);

  useFrame((_, delta) => {
    if (flying.current) {
      flyTime.current += delta;
      const duration = prefersReducedMotion ? 0.001 : 1.2;
      const t = Math.min(1, flyTime.current / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      camera.position.lerpVectors(flyStartPos.current, _flyPos, eased);
      lookTarget.current.lerpVectors(flyStartLook.current, _flyLook, eased);
      camera.lookAt(lookTarget.current);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(_flyTarget, eased);
        controlsRef.current.update();
      }
      if (t >= 1) {
        flying.current = false;
        if (controlsRef.current) controlsRef.current.enabled = true;
      }
      return;
    }

    if (controlsRef.current) {
      // keep the orbit pivot on the last place the camera looked at
      controlsRef.current.target.copy(lookTarget.current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      minDistance={2.5}
      maxDistance={34}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}
