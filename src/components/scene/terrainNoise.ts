import { createNoise2D } from 'simplex-noise';
import { hillZones } from '@/lib/data/poi';
import { LAKE_NOKOUE, LAKE_NOKOUE_RADIUS } from '@/lib/data/mapScale';

const noise2D = createNoise2D();

// Deterministic PRNG so hill domes are stable across reloads.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const domesCache = new Map<string, { x: number; y: number; r: number; h: number }[]>();
// Granite domes (Dassa) are built once per zone id, not per sample.
function getGraniteDomes(zoneId: string) {
  const cached = domesCache.get(zoneId);
  if (cached) return cached;
  const rng = mulberry32(zoneId.split('').reduce((s, c) => s + c.charCodeAt(0), 7));
  const domes: { x: number; y: number; r: number; h: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = Math.sqrt(rng()) * 0.92;
    domes.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      r: 0.14 + rng() * 0.3,
      h: 0.35 + rng() * 0.65,
    });
  }
  domesCache.set(zoneId, domes);
  return domes;
}

// Positive relief added by the two HillZone entries (Dassa granite domes,
// Atacora massif). Mirrors the Nokoué depression but in the other direction.
function hillBoost(x: number, y: number): number {
  let boost = 0;
  for (const zone of hillZones) {
    const dx = x - zone.center.x;
    const dy = y - zone.center.y;
    const dist = Math.hypot(dx, dy);
    if (dist >= zone.radius) continue;
    const t = 1 - dist / zone.radius;
    const falloff = t * t * (3 - 2 * t); // smoothstep

    if (zone.style === 'granite') {
      for (const dome of getGraniteDomes(zone.id)) {
        const d = Math.hypot(dx - dome.x, dy - dome.y);
        if (d >= dome.r) continue;
        const domeT = 1 - d / dome.r;
        boost += zone.heightBoost * dome.h * domeT * domeT * (3 - 2 * domeT);
      }
    } else {
      // montagne: rugged, high-frequency ridges. Both axes share the same
      // frequency (the map is projected isotropically — see mapScale.ts).
      const ridge =
        Math.abs(noise2D(x * 0.7 + 41, y * 0.7 + 41)) * 1.1 +
        noise2D(x * 1.9 + 41, y * 1.9 + 41) * 0.5;
      boost += zone.heightBoost * falloff * ridge;
    }
  }
  return boost;
}

// x: west(-) to east(+). y: south (0) to north (~21), matching poi.coords.
export function getTerrainHeight(x: number, y: number): number {
  // Combined noise, roughly in [-1, 1]. Same frequency on both axes so the
  // relief stays isotropic on the projected map.
  const elevation = noise2D(x * 0.1, y * 0.1) * 0.7 + noise2D(x * 0.5, y * 0.5) * 0.3;

  // The Atacora range makes the north noticeably higher and more rugged
  // than the flat southern coastal plain — but the south still needs a
  // clear base elevation above the water, not a scaled-down flat zero.
  const northFactor = Math.min(1, Math.max(0, y / 20));
  const base = 0.35 + northFactor * 0.9;
  const amplitude = 0.25 + northFactor * 0.9;
  const relief = base + elevation * amplitude;

  // Lake Nokoué depression, near Cotonou / Ganvié / Ouidah in the south —
  // the one place allowed to dip below the waterline.
  const distToNokoue = Math.hypot(x - LAKE_NOKOUE.x, y - LAKE_NOKOUE.y);
  const nokoueDepression =
    distToNokoue < LAKE_NOKOUE_RADIUS ? -0.7 * (LAKE_NOKOUE_RADIUS - distToNokoue) : 0;

  return Math.max(relief, -0.05) + nokoueDepression + hillBoost(x, y);
}
