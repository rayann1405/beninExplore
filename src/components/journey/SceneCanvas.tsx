'use client';
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ExpeditionScene from './ExpeditionScene';
import { useJourneyStore } from '@/lib/store';
import { DRAG_SENSITIVITY, modelInteraction } from './scroll/modelInteraction';

// Canvas opaque plein écran. Le fond et le brouillard sont pilotés par
// SceneAtmosphere (crossfade de palette lié au scroll), la caméra par
// JourneyCamera (trajectoire dérivée de `journey.length`).
//
// Rotation manuelle au pointeur : un cliqué-glissé horizontal sur le canvas
// fait pivoter le monument sur son axe Y — jamais la caméra (elle reste pilotée
// par le scroll). `touch-action: pan-y` : le glissement horizontal pivote, le
// scroll vertical continue de faire avancer le parcours (un doigt sur mobile).
export default function SceneCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current?.querySelector('canvas');
    if (!el) return;

    el.style.touchAction = 'pan-y';
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
    el.style.cursor = 'grab';

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      modelInteraction.dragging = true;
      modelInteraction.lastPointerX = e.clientX;
      modelInteraction.lastInteractAt = performance.now();
      if (e.pointerType === 'mouse') {
        el.style.cursor = 'grabbing';
        el.setPointerCapture(e.pointerId);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!modelInteraction.dragging) return;
      const dx = e.clientX - modelInteraction.lastPointerX;
      modelInteraction.lastPointerX = e.clientX;
      if (dx === 0) return;
      const active = useJourneyStore.getState().activeSectionIndex;
      const manual = modelInteraction.manual;
      manual.set(active, (manual.get(active) ?? 0) + dx * DRAG_SENSITIVITY);
      modelInteraction.lastInteractAt = performance.now();
    };

    const onUp = () => {
      modelInteraction.dragging = false;
      modelInteraction.lastInteractAt = performance.now();
      el.style.cursor = 'grab';
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 6, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
      >
        <Suspense fallback={null}>
          <ExpeditionScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
