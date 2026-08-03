'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import './gltf';

export interface GltfAsset {
  scene: THREE.Group;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

function findFirstMesh(node: THREE.Object3D): THREE.Mesh | null {
  for (const child of node.children) {
    if ((child as THREE.Mesh).isMesh) return child as THREE.Mesh;
    const found = findFirstMesh(child);
    if (found) return found;
  }
  return null;
}

// Loads a GLB (with DRACO) and extracts the first mesh's geometry/material —
// all of our assets are single-mesh, single-material GLBs so they can be
// GPU-instanced via drei <Instances>.
export function useGltfAsset(url: string): GltfAsset | null {
  const gltf = useGLTF(url, true);

  return useMemo(() => {
    if (!gltf?.scene) return null;
    const mesh = findFirstMesh(gltf.scene);
    if (!mesh) return null;
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    return {
      scene: gltf.scene,
      geometry: mesh.geometry,
      material,
    };
  }, [gltf]);
}

// Preloads a GLB so its decode starts while the journey is still up north.
export function preloadGltf(url: string) {
  useGLTF.preload(url, true);
}
