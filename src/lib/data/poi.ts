import { projectPoint } from './mapScale';

export type Region = 'nord' | 'centre' | 'sud';
export type Category = 'nature' | 'culture' | 'histoire' | 'ville' | 'monument';

export interface PoiAsset {
  // tier 1 = monuments sur-mesure (scans fournis ou en attente),
  // tier 2 = villages (variantes instanciées), tier 3 = végétation (masse instanciée).
  tier: 1 | 2 | 3;
  // Chemin public vers le GLB, ex: /modele/tier1/amazone.glb
  url: string;
  scale?: number;
  rotationY?: number;
  // Nombre d'instances pour la végétation (tier 3).
  instances?: number;
}

export interface PointOfInterestBase {
  id: string;
  region: Region;
  category: Category;
  coords: { x: number; y: number };
  // 1 = le plus au nord, croissant vers le sud.
  pathOrder: number;
  // Cadrage caméra au point d'arrêt du parcours, relatif au point au sol
  // G = (x, terrainHeight, -y) : position = G + offset, regard = G + lookAtOffset.
  camera: {
    offset: [number, number, number];
    lookAtOffset?: [number, number, number];
  };
  asset: PoiAsset;
}

export interface RoadSegment {
  id: string;
  type: 'principale' | 'secondaire';
  // Sous-ensembles ordonnés des mêmes points que le tracé nord->sud.
  waypointIds: string[];
  // Points de passage routiers hors-POI (intermédiaires du tracé réel).
  points?: { x: number; y: number }[];
  widthMeters: number;
}

export interface HillZone {
  id: string;
  center: { x: number; y: number };
  radius: number;
  heightBoost: number;
  style: 'granite' | 'montagne';
  rockPropsCount?: number;
}

export interface ForestZone {
  id: string;
  center?: { x: number; y: number };
  // band = true : liseré qui suit les points de bandPoints plutôt qu'un disque.
  band?: boolean;
  bandPoints?: { x: number; y: number }[];
  radius?: number;
  density: number;
  style: 'sacree' | 'savane' | 'palmeraie';
}

// Raw coordinates are written in "stylized longitude" (readable, roughly
// degree-like). The projected exports below stretch the longitude axis (see
// mapScale.ts) so the map is geographically proportional — every consumer
// works in the projected space automatically.
const rawPoiData: PointOfInterestBase[] = [
  {
    id: 'pendjari',
    region: 'nord',
    category: 'nature',
    coords: { x: -1.0, y: 19 },
    pathOrder: 1,
    camera: { offset: [1.8, 5.1, 3.3], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 3, url: '/modele/tier3/arbre.glb', instances: 3, scale: 1.4 },
  },
  {
    id: 'tanongou',
    region: 'nord',
    category: 'nature',
    coords: { x: 0.5, y: 17 },
    pathOrder: 2,
    camera: { offset: [1.4, 4.5, 3.0], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 3, url: '/modele/tier3/arbre.glb', instances: 2, scale: 1.2 },
  },
  {
    id: 'dassa',
    region: 'centre',
    category: 'culture',
    coords: { x: 0.3, y: 10 },
    pathOrder: 3,
    camera: { offset: [1.7, 4.8, 3.0], lookAtOffset: [0, 0.3, 0] },
    asset: { tier: 3, url: '/modele/tier3/rocher.glb', instances: 4, scale: 1.2 },
  },
  {
    id: 'abomey',
    region: 'centre',
    category: 'histoire',
    coords: { x: -0.5, y: 7 },
    pathOrder: 4,
    camera: { offset: [2.0, 4.5, 2.7], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 2, url: '/modele/tier2/afro-bresilien.glb', instances: 3, scale: 1 },
  },
  {
    id: 'ouidah',
    region: 'sud',
    category: 'histoire',
    coords: { x: -0.35, y: 1.25 },
    pathOrder: 5,
    camera: { offset: [1.5, 3.9, 2.4], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 2, url: '/modele/tier2/afro-bresilien.glb', instances: 4, scale: 1 },
  },
  {
    id: 'foret-kpasse',
    region: 'sud',
    category: 'culture',
    coords: { x: 0.05, y: 1.45 },
    pathOrder: 6,
    camera: { offset: [1.4, 3.6, 2.1], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 3, url: '/modele/tier3/arbre.glb', instances: 3, scale: 1.1 },
  },
  {
    id: 'ganvie',
    region: 'sud',
    category: 'culture',
    coords: { x: 1.05, y: 1.7 },
    pathOrder: 7,
    camera: { offset: [1.4, 3.6, 2.3], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 2, url: '/modele/tier2/pilotis.glb', instances: 3, scale: 1 },
  },
  {
    id: 'cotonou',
    region: 'sud',
    category: 'ville',
    coords: { x: 0.65, y: 0.65 },
    pathOrder: 8,
    camera: { offset: [1.7, 3.9, 2.4], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 2, url: '/modele/tier2/afro-bresilien.glb', instances: 4, scale: 1 },
  },
  {
    id: 'amazone',
    region: 'sud',
    category: 'monument',
    coords: { x: 0.9, y: 0.75 },
    pathOrder: 9,
    camera: { offset: [2.4, 6.0, 4.0], lookAtOffset: [0, 0.6, 0] },
    asset: { tier: 1, url: '/modele/tier1/amazone.opt.glb', scale: 1.4, rotationY: 0 },
  },
  {
    id: 'bio-guera',
    region: 'sud',
    category: 'monument',
    coords: { x: 0.2, y: 0.9 },
    pathOrder: 10,
    camera: { offset: [2.1, 4.5, 2.9], lookAtOffset: [0, 0.4, 0] },
    asset: { tier: 1, url: '/modele/tier1/bio-guera.opt.glb', scale: 1.3, rotationY: 0 },
  },
  {
    id: 'porto-novo',
    region: 'sud',
    category: 'ville',
    coords: { x: 1.35, y: 0.75 },
    pathOrder: 11,
    camera: { offset: [1.8, 3.9, 2.4], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 2, url: '/modele/tier2/afro-bresilien.glb', instances: 3, scale: 1 },
  },
  {
    id: 'grand-popo',
    region: 'sud',
    category: 'nature',
    coords: { x: -0.9, y: 0.3 },
    pathOrder: 12,
    camera: { offset: [1.5, 3.9, 2.7], lookAtOffset: [0, 0.2, 0] },
    asset: { tier: 3, url: '/modele/tier3/palmier.glb', instances: 4, scale: 1.1 },
  },
];

export const poiData = rawPoiData.map((p) => ({
  ...p,
  coords: projectPoint(p.coords),
}));

const rawRoadSegments: RoadSegment[] = [
  {
    id: 'axe-principal',
    type: 'principale',
    waypointIds: ['cotonou', 'abomey', 'dassa', 'tanongou', 'pendjari'],
    points: [
      { x: 0.5, y: 0.8 },
      { x: 0.0, y: 3.5 }, // vers Bohicon
      { x: -0.5, y: 7 }, // Abomey
      { x: 0.1, y: 8.8 },
      { x: 0.3, y: 10 }, // Dassa
      { x: 0.15, y: 11.8 },
      { x: -0.1, y: 13.2 },
      { x: -0.15, y: 14.8 }, // vers Djougou
      { x: 0.1, y: 16.2 }, // vers Natitingou
      { x: 0.5, y: 17 }, // Tanongou / Natitingou
      { x: -0.3, y: 18.2 }, // vers Tanguiéta
      { x: -1.0, y: 19 }, // vers la Pendjari
    ],
    widthMeters: 900,
  },
  {
    id: 'axe-cotier',
    type: 'principale',
    waypointIds: ['grand-popo', 'ouidah', 'cotonou', 'porto-novo'],
    points: [
      { x: -0.9, y: 0.3 },
      { x: -0.45, y: 0.55 },
      { x: 0.0, y: 1.2 }, // Ouidah
      { x: 0.25, y: 0.95 },
      { x: 0.5, y: 0.8 }, // Cotonou
      { x: 0.75, y: 0.7 },
      { x: 1.05, y: 0.7 }, // Porto-Novo
    ],
    widthMeters: 900,
  },
  {
    id: 'piste-ganvie',
    type: 'secondaire',
    waypointIds: ['cotonou', 'ganvie'],
    points: [
      { x: 0.5, y: 0.8 },
      { x: 0.55, y: 1.25 },
      { x: 0.65, y: 1.7 },
    ],
    widthMeters: 450,
  },
  {
    id: 'piste-kpasse',
    type: 'secondaire',
    waypointIds: ['ouidah', 'foret-kpasse'],
    points: [
      { x: 0.0, y: 1.2 },
      { x: 0.05, y: 1.15 },
    ],
    widthMeters: 350,
  },
];

export const roadSegments = rawRoadSegments.map((segment) => ({
  ...segment,
  points: segment.points?.map(projectPoint),
}));

const rawHillZones: HillZone[] = [
  {
    id: 'dassa-granite',
    center: { x: 0.3, y: 10 },
    radius: 1.3,
    heightBoost: 0.7,
    style: 'granite',
    rockPropsCount: 36,
  },
  {
    id: 'atacora',
    center: { x: -0.6, y: 18 },
    radius: 1.9,
    heightBoost: 1.3,
    style: 'montagne',
    rockPropsCount: 26,
  },
];

export const hillZones = rawHillZones.map((zone) => ({
  ...zone,
  center: projectPoint(zone.center),
}));

const rawForestZones: ForestZone[] = [
  {
    id: 'foret-sacree-kpasse',
    center: { x: 0.05, y: 1.15 },
    radius: 0.42,
    density: 150,
    style: 'sacree',
  },
  {
    id: 'savane-pendjari',
    center: { x: -0.8, y: 18.2 },
    radius: 1.5,
    density: 90,
    style: 'savane',
  },
  {
    id: 'liseres-palmiers',
    band: true,
    bandPoints: [
      { x: -1.1, y: 0.35 },
      { x: -0.45, y: 0.55 },
      { x: 0.0, y: 0.55 },
      { x: 0.55, y: 0.45 },
      { x: 1.15, y: 0.4 },
    ],
    density: 70,
    style: 'palmeraie',
  },
];

export const forestZones = rawForestZones.map((zone) => ({
  ...zone,
  center: zone.center ? projectPoint(zone.center) : undefined,
  bandPoints: zone.bandPoints?.map(projectPoint),
}));
