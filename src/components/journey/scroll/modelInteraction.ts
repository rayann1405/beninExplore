// État mutable NON réactif de l'interaction de rotation, partagé entre la
// scène R3F (lecture à chaque frame dans AssetModel) et les gestionnaires
// pointer du canvas (écriture). Volontairement hors de zustand : aucun
// re-render React pendant le glissement.
export const modelInteraction = {
  dragging: false,
  lastPointerX: 0,
  // Dernier appui, pour détecter le double-clic (double-tap) d'armement.
  lastPressAt: 0,
  lastPressX: 0,
  lastPressY: 0,
  // Rotation manuelle cumulée, par index de section.
  manual: new Map<number, number>(),
  // Rotation automatique cumulée, par index de section. Toujours active : le
  // glissement manuel s'y ajoute sans jamais l'interrompre.
  auto: new Map<number, number>(),
};

// Radians ajoutés par pixel de glissement horizontal.
export const DRAG_SENSITIVITY = 0.006;

// Vitesse de rotation automatique continue (rad/s), façon plateau tournant.
export const AUTO_ROTATE_SPEED = 0.18;

// Fenêtre (ms) et tolérance (px) du double-appui qui arme la rotation manuelle.
export const DOUBLE_PRESS_MS = 500;
export const DOUBLE_PRESS_SLOP = 28;
