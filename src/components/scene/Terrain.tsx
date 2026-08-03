import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getTerrainHeight } from './terrainNoise';
import { BENIN_OUTLINE, getOutlineBounds, isInsideOutline } from './geo';
import { createTerrainPbrMaterial } from './TerrainMaterial';
import { useZoneTextures } from './useZoneTextures';
import { LAKE_NOKOUE } from '@/lib/data/mapScale';

const CELL_SIZE = 0.12;
const OUTLINE_PADDING = 0.2;
const UNDERWATER_HEIGHT = -1.4;

// Builds a flat-shaded, low-poly heightfield clipped to the Benin outline.
// A regular grid is sampled and any cell entirely outside the silhouette is
// dropped, which naturally produces a jagged coastline that matches the
// polygon far more closely than the extruded outline alone would.
export function buildTerrainGeometry(outline: Array<[number, number]> = BENIN_OUTLINE) {
  const bounds = getOutlineBounds(outline);
  const minX = bounds.minX - OUTLINE_PADDING;
  const maxX = bounds.maxX + OUTLINE_PADDING;
  const minY = bounds.minY - OUTLINE_PADDING;
  const maxY = bounds.maxY + OUTLINE_PADDING;

  const segX = Math.max(1, Math.round((maxX - minX) / CELL_SIZE));
  const segY = Math.max(1, Math.round((maxY - minY) / CELL_SIZE));

  const grid: { x: number; y: number; z: number; height: number; inside: boolean }[][] = [];
  for (let j = 0; j <= segY; j++) {
    const row = [];
    const y = minY + (j / segY) * (maxY - minY);
    for (let i = 0; i <= segX; i++) {
      const x = minX + (i / segX) * (maxX - minX);
      const inside = isInsideOutline(x, y, outline);
      const height = inside ? getTerrainHeight(x, y) : UNDERWATER_HEIGHT;
      row.push({ x, y, z: -y, height, inside });
    }
    grid.push(row);
  }

  const positions: number[] = [];
  const normals: number[] = [];

  const pushTriangle = (
    a: { x: number; z: number; height: number },
    b: { x: number; z: number; height: number },
    c: { x: number; z: number; height: number }
  ) => {
    const va = new THREE.Vector3(a.x, a.height, a.z);
    const vb = new THREE.Vector3(b.x, b.height, b.z);
    const vc = new THREE.Vector3(c.x, c.height, c.z);
    const normal = new THREE.Vector3()
      .subVectors(vc, vb)
      .cross(new THREE.Vector3().subVectors(va, vb))
      .normalize();

    for (const v of [va, vb, vc]) {
      positions.push(v.x, v.y, v.z);
      normals.push(normal.x, normal.y, normal.z);
    }
  };

  for (let j = 0; j < segY; j++) {
    for (let i = 0; i < segX; i++) {
      const a = grid[j][i];
      const b = grid[j][i + 1];
      const c = grid[j + 1][i];
      const d = grid[j + 1][i + 1];

      // Skip cells that never touch land — keeps the mesh light and lets
      // the remaining cells carve out the coastline.
      if (!a.inside && !b.inside && !c.inside && !d.inside) continue;

      pushTriangle(a, b, c);
      pushTriangle(b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}

// Gradient shader: latérite in the north, gold savanna in the center, palm
// green toward the south — shared with the per-place mini-terrains so the
// whole site reads as one consistent relief.
// `centerY` lets a geometry built in local, camera-relative space (see
// buildLocalTerrainPatch) still resolve the correct absolute latitude for
// the north/center/south gradient — it's 0 for the national terrain, whose
// vertex positions are already in world space.
export function createTerrainMaterial(northExtent = 21, centerY = 0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorNorth: { value: new THREE.Color('#C1440E') },
      colorCenter: { value: new THREE.Color('#E8A93A') },
      colorSouth: { value: new THREE.Color('#2F6B4F') },
      colorDeep: { value: new THREE.Color('#061019') },
      northExtent: { value: northExtent },
      centerY: { value: centerY },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 colorNorth;
      uniform vec3 colorCenter;
      uniform vec3 colorSouth;
      uniform vec3 colorDeep;
      uniform float northExtent;
      uniform float centerY;
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        // worldZ = -centerY + vPosition.z (identity when centerY is 0).
        float worldZ = vPosition.z - centerY;
        float t = clamp(-worldZ / northExtent, 0.0, 1.0);

        vec3 color;
        if (t > 0.5) {
          float t2 = (t - 0.5) * 2.0;
          color = mix(colorCenter, colorNorth, t2);
        } else {
          float t2 = t * 2.0;
          color = mix(colorSouth, colorCenter, t2);
        }

        // Below-water vertices fade to deep ink so the coastline reads as
        // a drop-off rather than a flat cutout.
        float submerged = smoothstep(0.0, -1.0, vPosition.y);
        color = mix(color, colorDeep, submerged * 0.85);

        vec3 light = normalize(vec3(0.6, 1.0, 0.4));
        float intensity = max(dot(normalize(vNormal), light), 0.35);

        gl_FragColor = vec4(color * intensity, 1.0);
      }
    `,
  });
}

// Shared with the per-place mini-terrains so their north/south gradient
// lines up with the national map's.
export const NATIONAL_NORTH_EXTENT = getOutlineBounds().maxY + OUTLINE_PADDING;

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const textures = useZoneTextures();

  const geometry = useMemo(() => buildTerrainGeometry(), []);
  const bounds = useMemo(() => getOutlineBounds(), []);

  const fallbackMaterial = useMemo(
    () => createTerrainMaterial(bounds.maxY + OUTLINE_PADDING),
    [bounds]
  );

  const pbrMaterial = useMemo(
    () =>
      textures
        ? createTerrainPbrMaterial(
            textures,
            bounds.maxY + OUTLINE_PADDING,
            [LAKE_NOKOUE.x, LAKE_NOKOUE.y]
          )
        : null,
    [textures, bounds]
  );

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={pbrMaterial ?? fallbackMaterial}
      castShadow
      receiveShadow
    />
  );
}
