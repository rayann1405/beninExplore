import { poiData, PointOfInterestBase } from './poi';

// The journey travels north to south. `pathOrder` (1 = the northernmost,
// growing toward the south) is the single source of truth for the flight
// order — the camera curve and the scroll sections follow it.
export const journeyOrder: PointOfInterestBase[] = [...poiData].sort(
  (a, b) => a.pathOrder - b.pathOrder
);
