import type { JourneyPalette } from '@/lib/data/journey';

// Tokens visuels par lieu : dominante du fond, brouillard, teinte de la
// lumière, accent des monuments, particules (couleur, densité, vitesse).
// Chaque lieu béninois a sa propre ambiance — Cotonou (terre cuite, or,
// rouge profond, monumental) ; Abomey (terre, ocre, rouge, royal) ; Ouidah
// (sable, bleu profond, or, spirituel) ; Ganvié (bleu, vert, sable,
// aquatique) ; Porto-Novo (ocre, vert, jaune, culturel). La palette teinte
// la lumière et les particules autour du modèle — jamais l'identité globale.
//
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
  cotonou: {
    background: '#2A1106',
    fog: '#1D0B04',
    light: '#E5743C',
    accent: '#DDA33C',
    particle: '#E5743C',
    particleAlt: '#DDA33C',
    particleCount: 950,
    particleSpeed: 0.25,
  },
  abomey: {
    background: '#210C04',
    fog: '#170803',
    light: '#C14B1A',
    accent: '#E5A83E',
    particle: '#A93217',
    particleAlt: '#DDA33C',
    particleCount: 900,
    particleSpeed: 0.22,
  },
  ouidah: {
    background: '#0A1A2E',
    fog: '#071422',
    light: '#E5C58A',
    accent: '#DDA33C',
    particle: '#8CA5C4',
    particleAlt: '#E5C58A',
    particleCount: 1050,
    particleSpeed: 0.3,
  },
  ganvie: {
    background: '#08252B',
    fog: '#061B20',
    light: '#4FA97C',
    accent: '#E4C58F',
    particle: '#4FA97C',
    particleAlt: '#E4C58F',
    particleCount: 1000,
    particleSpeed: 0.28,
  },
  'porto-novo': {
    background: '#231205',
    fog: '#180B03',
    light: '#DDA33C',
    accent: '#3F7C52',
    particle: '#DDA33C',
    particleAlt: '#3F7C52',
    particleCount: 1000,
    particleSpeed: 0.32,
  },
};

export function paletteFor(palette: JourneyPalette): Palette {
  return PALETTES[palette];
}
