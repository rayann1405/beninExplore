import { create } from 'zustand';

export type MapMode = 'journey' | 'free';

interface MapState {
  // Navigation mode: scripted scrolled journey (default) or free orbit.
  mode: MapMode;
  setMode: (mode: MapMode) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  // Continuous scroll progress through the north-to-south journey, 0..1.
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  // Index of the point of interest the camera is currently closest to,
  // used to highlight its marker and its journey section.
  activePoiIndex: number;
  setActivePoiIndex: (index: number) => void;
  // Stop requested by a click in free-explore mode (camera flies to it).
  selectedPoiId: string | null;
  setSelectedPoiId: (id: string | null) => void;
  // Stop index the UI asked to scroll to (ProgressGauge / replay). Consumed
  // by ScrollProgressSync which positions the drei scroll container.
  jumpTarget: number | null;
  requestJump: (index: number | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  mode: 'journey',
  setMode: (mode) => set({ mode }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  activePoiIndex: 0,
  setActivePoiIndex: (index) => set({ activePoiIndex: index }),
  selectedPoiId: null,
  setSelectedPoiId: (id) => set({ selectedPoiId: id }),
  jumpTarget: null,
  requestJump: (index) => set({ jumpTarget: index }),
}));
