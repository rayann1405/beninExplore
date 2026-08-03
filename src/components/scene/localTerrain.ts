import * as THREE from 'three';
import { getTerrainHeight } from './terrainNoise';

// Builds a small flat-shaded relief disc sampled from the same noise field
// as the national terrain, centered on a single point of interest. Used by
// the per-place mini-scenes so each `/lieux/[slug]` page shows a real
// excerpt of the map's relief rather than a generic shape.
export function buildLocalTerrainPatch(
  centerX: number,
  centerY: number,
  radius = 1.6,
  rings = 14,
  segments = 28
) {
  const sample = (dx: number, dy: number) => {
    const x = centerX + dx;
    const y = centerY + dy;
    return { x: dx, z: -dy, height: getTerrainHeight(x, y) };
  };

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

  const center = sample(0, 0);
  const ringPoints: ReturnType<typeof sample>[][] = [];
  for (let r = 1; r <= rings; r++) {
    const rr = (radius * r) / rings;
    const row: ReturnType<typeof sample>[] = [];
    for (let s = 0; s < segments; s++) {
      const theta = (s / segments) * Math.PI * 2;
      row.push(sample(Math.cos(theta) * rr, Math.sin(theta) * rr));
    }
    ringPoints.push(row);
  }

  // Fan the innermost ring from the center point.
  const innerRing = ringPoints[0];
  for (let s = 0; s < segments; s++) {
    const next = innerRing[(s + 1) % segments];
    pushTriangle(center, innerRing[s], next);
  }

  // Quad-strip between consecutive rings.
  for (let r = 0; r < rings - 1; r++) {
    const inner = ringPoints[r];
    const outer = ringPoints[r + 1];
    for (let s = 0; s < segments; s++) {
      const sNext = (s + 1) % segments;
      pushTriangle(inner[s], outer[s], outer[sNext]);
      pushTriangle(inner[s], outer[sNext], inner[sNext]);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}
