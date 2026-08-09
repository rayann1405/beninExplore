import { create } from 'zustand';

interface JourneyState {
  // Index de la section du parcours actuellement centrée à l'écran.
  // Mis à jour uniquement quand l'index change (pas à chaque frame).
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activeSectionIndex: 0,
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
}));
