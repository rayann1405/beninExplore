import { CalendarDays, Landmark, ScrollText, TreePalm, type LucideIcon } from 'lucide-react';
import type { JourneyType } from '@/lib/data/journey';

// Accent visuel par catégorie, cohérent avec la palette du projet : chaque type
// (monument / événement / histoire / nature) a sa couleur — pas seulement le
// libellé du badge. Voir ACCENT_STYLES pour les classes Tailwind.
export type AccentKey = 'laterite' | 'gold' | 'indigo' | 'palm';

export interface TypeMeta {
  label: string;
  icon: LucideIcon;
  accent: AccentKey;
}

export const JOURNEY_TYPE_META: Record<JourneyType, TypeMeta> = {
  monument: { label: 'Monument', icon: Landmark, accent: 'laterite' },
  evenement: { label: 'Événement', icon: CalendarDays, accent: 'gold' },
  histoire: { label: 'Histoire', icon: ScrollText, accent: 'indigo' },
  nature: { label: 'Nature', icon: TreePalm, accent: 'palm' },
};

export const ACCENT_STYLES: Record<
  AccentKey,
  { text: string; border: string; bg: string; dot: string }
> = {
  laterite: {
    text: 'text-laterite-light',
    border: 'border-laterite-light/40',
    bg: 'bg-laterite-light/10',
    dot: 'bg-laterite-light',
  },
  gold: {
    text: 'text-gold',
    border: 'border-gold/40',
    bg: 'bg-gold/10',
    dot: 'bg-gold',
  },
  indigo: {
    text: 'text-indigo-light',
    border: 'border-indigo-light/40',
    bg: 'bg-indigo-light/10',
    dot: 'bg-indigo-light',
  },
  palm: {
    text: 'text-palm-light',
    border: 'border-palm-light/40',
    bg: 'bg-palm-light/10',
    dot: 'bg-palm-light',
  },
};
