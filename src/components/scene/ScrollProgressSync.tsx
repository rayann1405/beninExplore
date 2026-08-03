'use client';
import { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMapStore } from '@/lib/store';
import { journeyOrder } from '@/lib/data/journeyOrder';

const TOTAL_PAGES = journeyOrder.length + 2;

// Bridges drei's ScrollControls offset (0..1 across intro + stops + outro
// pages) into the zustand store the camera rig and HTML overlay read, and
// turns `jumpTarget` requests (ProgressGauge / replay) into real scroll
// positions on the drei scroll container.
export default function ScrollProgressSync() {
  const scroll = useScroll();
  const elRef = useRef<HTMLDivElement | null>(null);
  const handled = useRef(-2);

  useFrame(() => {
    const { jumpTarget, requestJump } = useMapStore.getState();
    if (!elRef.current) elRef.current = scroll.el as HTMLDivElement;
    if (jumpTarget !== null && jumpTarget !== handled.current) {
      handled.current = jumpTarget;
      const offset = (jumpTarget + 1) / TOTAL_PAGES;
      const threshold = elRef.current.scrollHeight - elRef.current.clientHeight;
      elRef.current.scrollTop = offset * threshold;
      requestJump(null);
    }
    useMapStore.getState().setScrollProgress(scroll.offset);
  });

  return null;
}
