// Map projection for the stylized national space.
//
// The coordinate space below (geo.ts outline, poi.ts coords) exaggerates the
// north-south axis: ~21 units for ~6.2° of latitude. Real Benin spans ~6.2°
// of latitude (≈700 km) and ~3.1° of longitude (≈345 km) — a ~2:1 tall:wide
// silhouette. Without correction the country renders as a skinny, almost
// unrecognizable column (4.4 × 21 units). Stretching the longitude axis by
// MAP_SCALE_X makes one world unit the same distance on both axes (~32 km),
// so the silhouette reads as Benin and features spread out naturally.
export const MAP_SCALE_X = 2.4;

export const projectLon = (lon: number) => lon * MAP_SCALE_X;

export const projectPoint = (p: { x: number; y: number }) => ({
  x: projectLon(p.x),
  y: p.y,
});

// Lake Nokoué (near Cotonou / Ganvié), in the same projected space. Shared
// by the terrain depression (terrainNoise), the water surface (Water) and
// the shoreline sand mask (TerrainMaterial) so they always align.
export const LAKE_NOKOUE = projectPoint({ x: 0.4, y: 1.3 });
export const LAKE_NOKOUE_RADIUS = 1.1;
