import { journey } from '@/lib/data/journey';
import { getSectionHeight } from './sectionHeights';

// Positions de caméra calculées, jamais codées en dur : tout dérive de
// `journey.length` et de la hauteur du contenu de chaque section. Les étapes
// sont espacées régulièrement le long de l'axe X, avec une légère courbe.

export const JOURNEY_STEP = 16; // espacement entre sections sur l'axe X

// Cadrage adaptatif : la caméra monte et recule selon la hauteur H du contenu
// (modèle mesuré au runtime, ou décor par défaut) pour que le monument soit
// visible en entier dans le cadre, quelle que soit sa taille.
export const CAMERA_HEIGHT_FACTOR = 0.55; // hauteur caméra = max(H × 0.55, 3)
export const CAMERA_DISTANCE_FACTOR = 1.55; // recul = H × 1.55
export const LOOK_HEIGHT_FACTOR = 0.45; // point visé = H × 0.45

export function sectionPosition(index: number, count = journey.length): [number, number, number] {
  return [(index - (count - 1) / 2) * JOURNEY_STEP, 0, 0];
}

export function sectionCameraTarget(
  index: number,
  count = journey.length
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const x = (index - (count - 1) / 2) * JOURNEY_STEP;
  const h = getSectionHeight(index);
  const arc = Math.sin((index / Math.max(count - 1, 1)) * Math.PI) * 2.5;
  return {
    position: [x, Math.max(h * CAMERA_HEIGHT_FACTOR, 3) + arc, h * CAMERA_DISTANCE_FACTOR + (index % 2) * 1.5],
    lookAt: [x, h * LOOK_HEIGHT_FACTOR, 0],
  };
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Position/lookAt continus pour un t ∈ [0, count - 1], lissés entre les
// cibles des sections voisines (pas de saut brusque entre deux arrêts).
export function sampleJourney(
  t: number
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const count = journey.length;
  const last = count - 1;
  const i = clamp(Math.floor(t), 0, last);
  const f = smoothstep(clamp(t - i, 0, 1));
  const a = sectionCameraTarget(i, count);
  const b = sectionCameraTarget(Math.min(i + 1, last), count);
  return {
    position: [
      a.position[0] + (b.position[0] - a.position[0]) * f,
      a.position[1] + (b.position[1] - a.position[1]) * f,
      a.position[2] + (b.position[2] - a.position[2]) * f,
    ],
    lookAt: [
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * f,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * f,
      0,
    ],
  };
}
