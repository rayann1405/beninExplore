import * as THREE from 'three';
import { journeyOrder } from '@/lib/data/journeyOrder';
import { getTerrainHeight } from './terrainNoise';

// Fraction of total scroll reserved for the intro / outro screens. With
// pages = stops + 2, each screen is one full page.
export const INTRO_PORTION = 1 / (journeyOrder.length + 2);
export const OUTRO_PORTION = 1 / (journeyOrder.length + 2);

// The camera rests, at each stop, at groundPoint + camera.offset and gazes
// at groundPoint + camera.lookAtOffset. Two twin Catmull-Rom curves (same
// control-point layout) keep camera and gaze in sync along the flight.
interface Keyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

function groundPoint(poi: { coords: { x: number; y: number } }) {
  return new THREE.Vector3(
    poi.coords.x,
    getTerrainHeight(poi.coords.x, poi.coords.y),
    -poi.coords.y
  );
}

function buildKeyframes(): Keyframe[] {
  const stops = journeyOrder.map((poi) => {
    const g = groundPoint(poi);
    const [ox, oy, oz] = poi.camera.offset;
    const look = poi.camera.lookAtOffset ?? [0, 0.3, 0];
    return {
      position: new THREE.Vector3(g.x + ox, g.y + oy, g.z + oz),
      lookAt: new THREE.Vector3(g.x + look[0], g.y + look[1], g.z + look[2]),
    };
  });

  const keys: Keyframe[] = [];
  for (let i = 0; i < stops.length; i++) {
    keys.push(stops[i]);
    if (i < stops.length - 1) {
      const a = journeyOrder[i];
      const b = journeyOrder[i + 1];
      const mx = (a.coords.x + b.coords.x) / 2;
      const my = (a.coords.y + b.coords.y) / 2;
      const mg = getTerrainHeight(mx, my);
      // Panoramic arc: higher and pushed to the side relative to the two
      // adjacent resting offsets.
      const avgOff = [
        (a.camera.offset[0] + b.camera.offset[0]) / 2,
        (a.camera.offset[1] + b.camera.offset[1]) / 2,
        (a.camera.offset[2] + b.camera.offset[2]) / 2,
      ];
      keys.push({
        position: new THREE.Vector3(
          mx + avgOff[0] * 0.5,
          mg + avgOff[1] * 1.5 + 1.4,
          -my + avgOff[2] * 0.5
        ),
        lookAt: new THREE.Vector3(mx, mg + 0.15, -my),
      });
    }
  }
  return keys;
}

const keys = buildKeyframes();
const stopCount = journeyOrder.length;
// Curve control points = [leadIn, keys[0], keys[1], ..., leadOut]. Keys hold
// stops at even indices (0, 2, 4, …) and panoramic interps at odd ones, so
// stop i sits at curve parameter (2i + 1) / (2 * stopCount).
const stopU = Array.from({ length: stopCount }, (_, i) => (2 * i + 1) / (2 * stopCount));
const stopT = stopU.map((_, i) => i / (stopCount - 1));

// The opening shot: a high, country-wide vantage over the whole silhouette
// (the map is ~10.6 × 21 units in world space after projection). The camera
// glides down onto stop 0 (Pendjari) across the intro page.
const INTRO_POSE = {
  position: new THREE.Vector3(0.7, 28, 12),
  lookAt: new THREE.Vector3(0.7, 9.7, -9.7),
};
const STOP0_POSE = {
  position: keys[0].position.clone(),
  lookAt: keys[0].lookAt.clone(),
};
const LAST_POSE = {
  position: keys[keys.length - 1].position.clone(),
  lookAt: keys[keys.length - 1].lookAt.clone(),
};

// Extrapolated lead-in / lead-out so the curve has clean tangents at both ends.
function extrapolate(first: Keyframe, second: Keyframe): Keyframe {
  return {
    position: first.position.clone().add(first.position.clone().sub(second.position)),
    lookAt: first.lookAt.clone().add(first.lookAt.clone().sub(second.lookAt)),
  };
}

const cameraCurve = new THREE.CatmullRomCurve3(
  [extrapolate(keys[0], keys[1]).position, ...keys.map((k) => k.position), extrapolate(keys[keys.length - 1], keys[keys.length - 2]).position],
  false,
  'centripetal',
  0.5
);
const lookCurve = new THREE.CatmullRomCurve3(
  [extrapolate(keys[0], keys[1]).lookAt, ...keys.map((k) => k.lookAt), extrapolate(keys[keys.length - 1], keys[keys.length - 2]).lookAt],
  false,
  'centripetal',
  0.5
);

// Maps camera progress (0..1 over the stops) -> curve parameter by
// piecewise-linear interpolation between consecutive stops' native params.
// Two distant stops get exactly the same scroll slice as two close ones,
// so the camera settles on every stop instead of flying past the south.
function progressToCurveParam(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  if (c <= stopT[0]) return stopU[0];
  if (c >= stopT[stopCount - 1]) return stopU[stopCount - 1];
  for (let i = 0; i < stopCount - 1; i++) {
    if (c >= stopT[i] && c <= stopT[i + 1]) {
      const span = stopT[i + 1] - stopT[i];
      const local = span > 0 ? (c - stopT[i]) / span : 0;
      return THREE.MathUtils.lerp(stopU[i], stopU[i + 1], local);
    }
  }
  return stopU[stopCount - 1];
}

export interface JourneyPose {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  activeIndex: number;
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

// progress: 0..1 across the whole journey — intro page (country-wide reveal,
// gliding down onto stop 0), the stops (twin curve), outro page (held on the
// last stop). The caller feeds ScrollControls' scroll.offset directly.
export function sampleJourney(progress: number): JourneyPose {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const introEnd = INTRO_PORTION;
  const outroStart = 1 - OUTRO_PORTION;

  if (p <= introEnd) {
    const u = introEnd > 0 ? Math.min(1, p / introEnd) : 1;
    const ease = u * u * (3 - 2 * u); // smoothstep — slow settle onto stop 0
    _pos.lerpVectors(INTRO_POSE.position, STOP0_POSE.position, ease);
    _look.lerpVectors(INTRO_POSE.lookAt, STOP0_POSE.lookAt, ease);
    return { position: _pos.clone(), lookAt: _look.clone(), activeIndex: 0 };
  }

  if (p >= outroStart) {
    return {
      position: LAST_POSE.position.clone(),
      lookAt: LAST_POSE.lookAt.clone(),
      activeIndex: stopCount - 1,
    };
  }

  const span = outroStart - introEnd;
  const t = span > 0 ? (p - introEnd) / span : 0;
  const u = progressToCurveParam(t);
  cameraCurve.getPoint(u, _pos);
  lookCurve.getPoint(u, _look);

  let activeIndex = 0;
  let best = Infinity;
  for (let i = 0; i < stopT.length; i++) {
    const d = Math.abs(stopT[i] - t);
    if (d < best) {
      best = d;
      activeIndex = i;
    }
  }

  return { position: _pos.clone(), lookAt: _look.clone(), activeIndex };
}

// World-space ground position of a stop (for click-to-fly in free mode).
export function stopGroundPosition(index: number) {
  const poi = journeyOrder[index];
  return groundPoint(poi);
}
