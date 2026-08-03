// Stylized but geographically-informed silhouette of Benin.
// Coordinates are [x, y] in the same space as PointOfInterestBase.coords:
// x runs roughly west (-) to east (+), y runs south (0) to north (~21).
// The outline traces (SW coast) -> (SE coast) -> up the Nigeria border with
// its Borgou/Kandi bulge -> the Malanville tip in the far north -> back down
// along the Niger/Burkina Faso border -> the Atacora bulge in the north-west
// -> down the Togo border to close the loop.
import { projectLon } from '@/lib/data/mapScale';

export const BENIN_OUTLINE: Array<[number, number]> = [
  [projectLon(-1.3), -0.2], // SW coast, Togo border (west of Grand-Popo)
  [projectLon(0.0), -0.4], // Cotonou coast
  [projectLon(1.3), -0.1], // SE coast, Nigeria border (east of Porto-Novo)
  [projectLon(1.7), 3.0],
  [projectLon(1.9), 6.5], // past Kétou
  [projectLon(2.3), 9.5], // Borgou bulge east (Save / Nikki)
  [projectLon(2.5), 13.0], // Kandi region
  [projectLon(2.1), 16.5],
  [projectLon(1.7), 19.0],
  [projectLon(1.0), 20.8], // northernmost point, near Malanville / Niger river bend
  [projectLon(0.2), 20.5], // along the Niger border, heading west
  [projectLon(-0.7), 19.8], // toward the Niger/Burkina Faso tripoint (W park area)
  [projectLon(-1.6), 18.5], // Atacora bulge, Pendjari area
  [projectLon(-1.9), 16.0], // westernmost extent of the Atacora range
  [projectLon(-1.5), 13.5],
  [projectLon(-1.2), 11.0],
  [projectLon(-1.4), 8.5],
  [projectLon(-1.1), 6.0],
  [projectLon(-1.3), 3.0], // Togo border approaching the coast
];

export function getOutlineBounds(outline: Array<[number, number]> = BENIN_OUTLINE) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of outline) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY };
}

// Ray-casting point-in-polygon test.
export function isInsideOutline(
  x: number,
  y: number,
  outline: Array<[number, number]> = BENIN_OUTLINE
): boolean {
  let inside = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, yi] = outline[i];
    const [xj, yj] = outline[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
