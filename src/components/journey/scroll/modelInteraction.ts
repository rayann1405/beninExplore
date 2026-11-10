// État mutable NON réactif de l'interaction de rotation, partagé entre la
// scène R3F (lecture à chaque frame dans AssetModel) et les gestionnaires
// pointer du canvas (écriture). Volontairement hors de zustand : aucun
// re-render React pendant le glissement.
export const modelInteraction = {
  dragging: false,
  lastPointerX: 0,
  lastInteractAt: 0,
  // Rotation manuelle cumulée, par index de section.
  manual: new Map<number, number>(),
  // Rotation automatique cumulée (reprise en idle), par index de section.
  auto: new Map<number, number>(),
};

// Radians ajoutés par pixel de glissement horizontal.
export const DRAG_SENSITIVITY = 0.006;

// Vitesse de rotation automatique de repos (rad/s), façon plateau tournant.
export const AUTO_ROTATE_SPEED = 0.18;

// Délai d'inactivité avant reprise de la rotation automatique (ms).
export const IDLE_RESUME_MS = 2600;
