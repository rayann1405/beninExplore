'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { roadSegments, poiData, RoadSegment } from '@/lib/data/poi';
import { getTerrainHeight } from './terrainNoise';

const METER_TO_UNIT = 1 / 32000; // 1 unit ≈ 32 km (north-south scale)
const WIDTH_EXAGGERATION = 4; // kept visible at country overview

const poiById = new Map(poiData.map((p) => [p.id, p]));

interface RoadMaterialConfig {
  principale: { color: string; roughness: number };
  secondaire: { color: string; roughness: number };
}

const CONFIG: RoadMaterialConfig = {
  principale: { color: '#4A4E55', roughness: 0.85 },
  secondaire: { color: '#9A4522', roughness: 1 },
};

function resolvePoints(segment: RoadSegment): { x: number; y: number }[] {
  const ids = segment.points?.length ? segment.points : [];
  for (const id of segment.waypointIds) {
    const poi = poiById.get(id);
    if (poi) ids.push(poi.coords);
  }
  // Avoid duplicated consecutive points (waypointIds + points overlap).
  const out: { x: number; y: number }[] = [];
  for (const p of ids) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 1e-3) out.push(p);
  }
  return out;
}

// Samples the segment polyline and returns a triangle-strip ribbon whose
// vertices are lifted to follow the terrain (not a flat decal).
function buildRoadGeometry(segment: RoadSegment) {
  const points = resolvePoints(segment);
  const halfWidth = (segment.widthMeters * METER_TO_UNIT * WIDTH_EXAGGERATION) / 2;
  const SEGMENTS = 14;

  const world: THREE.Vector3[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const steps = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) * SEGMENTS));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      world.push(new THREE.Vector3(x, getTerrainHeight(x, y), -y));
    }
  }
  const last = points[points.length - 1];
  world.push(new THREE.Vector3(last.x, getTerrainHeight(last.x, last.y), -last.y));

  const positions: number[] = [];

  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const left = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  const prev = new THREE.Vector3();
  const next = new THREE.Vector3();

  const pushRing = (i: number) => {
    prev.copy(world[Math.max(0, i - 1)]);
    next.copy(world[Math.min(world.length - 1, i + 1)]);
    tangent.subVectors(next, prev).setY(0).normalize();
    side.crossVectors(tangent, up).normalize();
    left.copy(world[i]).addScaledVector(side, halfWidth);
    right.copy(world[i]).addScaledVector(side, -halfWidth);
    left.y = right.y = getTerrainHeight(world[i].x, -world[i].z);
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
  };

  for (let i = 0; i < world.length; i++) pushRing(i);

  // Triangle strip indices.
  const indices: number[] = [];
  for (let i = 0; i < world.length - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function Roads() {
  const roads = useMemo(
    () =>
      roadSegments.map((segment) => ({
        segment,
        geometry: buildRoadGeometry(segment),
      })),
    []
  );

  return (
    <group>
      {roads.map(({ segment, geometry }) => (
        <mesh key={segment.id} geometry={geometry} receiveShadow>
          <meshStandardMaterial
            color={CONFIG[segment.type].color}
            roughness={CONFIG[segment.type].roughness}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}
