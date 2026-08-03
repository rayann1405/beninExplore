import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMapStore } from '@/lib/store';
import { sampleJourney } from './journeyPath';

// Drives the camera from `scrollProgress` (written by ScrollControls via
// ScrollProgressSync) instead of free orbit controls — scrolling is the only
// way to move through the map in journey mode. The intro page is a high
// country-wide reveal that glides down onto stop 0; each stop's
// camera.offset / camera.lookAtOffset rest the camera on a framing keyframe;
// between stops the twin Catmull-Rom curves (journeyPath) sweep a panoramic
// arc.
export default function JourneyCameraRig() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const lastActiveIndex = useRef(-1);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    const { scrollProgress } = useMapStore.getState();
    const pose = sampleJourney(scrollProgress);
    currentPos.current.copy(pose.position);
    currentLookAt.current.copy(pose.lookAt);
    camera.position.copy(pose.position);
    camera.lookAt(pose.lookAt);
  }, [camera]);

  useFrame(() => {
    const { scrollProgress, setActivePoiIndex } = useMapStore.getState();
    const pose = sampleJourney(scrollProgress);

    if (pose.activeIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = pose.activeIndex;
      setActivePoiIndex(pose.activeIndex);
    }

    if (prefersReducedMotion) {
      // Direct jumps between key positions, no prolonged easing.
      camera.position.copy(pose.position);
      camera.lookAt(pose.lookAt);
      return;
    }

    const damping = 0.09;
    currentPos.current.lerp(pose.position, damping);
    currentLookAt.current.lerp(pose.lookAt, damping);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
