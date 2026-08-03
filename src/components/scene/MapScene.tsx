import { Suspense, useEffect } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import Terrain from './Terrain';
import Water from './Water';
import Roads from './Roads';
import PoiModels from './PoiModels';
import ForestZones from './ForestZones';
import HillZones from './HillZones';
import JourneyCameraRig from './JourneyCameraRig';
import FreeOrbitControls from './FreeOrbitControls';
import Fireflies from './Fireflies';
import { useMapStore } from '@/lib/store';
import { preloadGltf } from './useGltfAsset';

// Tier-1 scans start decoding as soon as the canvas mounts, long before the
// journey reaches the south.
const TIER1_URLS = ['/modele/tier1/amazone.opt.glb', '/modele/tier1/bio-guera.opt.glb'];

export default function MapScene() {
  const group = useRef<THREE.Group>(null);
  const mode = useMapStore((s) => s.mode);

  useEffect(() => {
    TIER1_URLS.forEach(preloadGltf);
  }, []);

  return (
    <group ref={group}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#F2EDE1" />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#E8A93A" />

      <Terrain />
      <Water />
      <Roads />

      {/* Asset-loading components suspend (useGLTF); keep the scene alive
          while the first GLBs decode. */}
      <Suspense fallback={null}>
        <PoiModels />
        <ForestZones />
        <HillZones />
      </Suspense>

      <Fireflies />

      {mode === 'journey' ? <JourneyCameraRig /> : <FreeOrbitControls />}
    </group>
  );
}
