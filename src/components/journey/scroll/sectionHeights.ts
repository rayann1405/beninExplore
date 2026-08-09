// Hauteur monde du contenu de chaque section, mesurée au runtime (bounding box
// du modèle chargé) ou valeur par défaut pour les sections sans modèle. La
// caméra s'y adapte : plus le contenu est haut, plus elle recule pour le cadrer
// en entier. Module non-réactif, lu à chaque frame par la caméra.
export const DEFAULT_CONTENT_HEIGHT = 3.2;

const heights: number[] = [];

export function getSectionHeight(index: number): number {
  return heights[index] ?? DEFAULT_CONTENT_HEIGHT;
}

export function setSectionHeight(index: number, height: number) {
  if (!Number.isFinite(height) || height <= 0) return;
  heights[index] = height;
}
