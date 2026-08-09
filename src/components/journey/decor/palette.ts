import type { JourneyPalette } from '@/lib/data/journey';

// Tokens visuels par palette : dominante du fond, brouillard, teinte de la
// lumière, accent des monuments, particules (couleur, densité, vitesse).
// Une section sans modèle 3D s'habille de sa palette ; avec modèle, la palette
// teinte la lumière et les particules autour.

export interface Palette {
  background: string;
  fog: string;
  light: string;
  accent: string;
  particle: string;
  particleAlt?: string;
  particleCount: number;
  particleSpeed: number;
}

export const PALETTES: Record<JourneyPalette, Palette> = {
  'nuit-indigo': {
    background: '#0E1B33',
    fog: '#0A1426',
    light: '#8FA6C7',
    accent: '#7C6BCB',
    particle: '#8FA6C7',
    particleCount: 1100,
    particleSpeed: 0.35,
  },
  'latérite': {
    background: '#2A1207',
    fog: '#1E0C05',
    light: '#E86A34',
    accent: '#E8A93A',
    particle: '#E86A34',
    particleCount: 900,
    particleSpeed: 0.25,
  },
  'or': {
    background: '#1F1603',
    fog: '#161003',
    light: '#E8A93A',
    accent: '#F5C85C',
    particle: '#E8A93A',
    particleCount: 1000,
    particleSpeed: 0.3,
  },
  'palmier': {
    background: '#071B12',
    fog: '#051408',
    light: '#4CAF7A',
    accent: '#2F6B4F',
    particle: '#4CAF7A',
    particleCount: 1000,
    particleSpeed: 0.3,
  },
  'fete': {
    background: '#1B0F2E',
    fog: '#130A22',
    light: '#FF5D8F',
    accent: '#FFD23F',
    particle: '#FF5D8F',
    particleAlt: '#FFD23F',
    particleCount: 1600,
    particleSpeed: 0.8,
  },
};

export function paletteFor(palette: JourneyPalette): Palette {
  return PALETTES[palette];
}
