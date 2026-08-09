import { MapPin, CalendarDays, Landmark } from 'lucide-react';
import type { JourneySection } from '@/lib/data/journey';
import SplitTitle from './SplitTitle';
import Motif from './Motif';

// Bloc texte d'une étape du parcours : panneau façon « objet exposé » —
// coins bronze, filigrane Adanhoumè, numéro d'étape, type, titre animé,
// accroche, description, dates récurrentes (événements), lieu et fait marquant.
export default function SectionPanel({
  section,
  index,
  total,
}: {
  section: JourneySection;
  index: number;
  total: number;
}) {
  const isEvent = section.type === 'evenement';
  const Icon = isEvent ? CalendarDays : Landmark;

  return (
    <div className="relative max-w-xl">
      <span aria-hidden className="absolute -left-1.5 -top-1.5 h-5 w-5 border-l-2 border-t-2 border-gold/80" />
      <span aria-hidden className="absolute -right-1.5 -top-1.5 h-5 w-5 border-r-2 border-t-2 border-gold/80" />
      <span aria-hidden className="absolute -bottom-1.5 -left-1.5 h-5 w-5 border-b-2 border-l-2 border-gold/80" />
      <span aria-hidden className="absolute -bottom-1.5 -right-1.5 h-5 w-5 border-b-2 border-r-2 border-gold/80" />

      <div className="relative overflow-hidden border border-paper/10 bg-gradient-to-br from-ink/85 via-ink/70 to-ink/30 p-7 backdrop-blur-md md:p-9">
        <div aria-hidden className="diamond-grid pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
              Étape{' '}
              <span className="text-paper">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-paper/40"> / {String(total).padStart(2, '0')}</span>
            </p>
            <span className="inline-flex items-center gap-2 border border-gold/25 bg-gold/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
              <Icon size={12} className={isEvent ? 'text-palm-light' : 'text-laterite-light'} />
              {isEvent ? 'Événement' : 'Monument'}
            </span>
          </div>

          <div className="mt-6">
            <SplitTitle
              text={section.name}
              className="font-display text-3xl leading-[1.05] text-paper md:text-5xl"
            />
          </div>

          <p className="mt-4 font-sans text-lg font-medium text-gold-light">{section.tagline}</p>

          <Motif variant="line" className="mt-5 w-64 text-gold/60" />

          {section.dates && (
            <p className="mt-5 inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-3 py-1.5 font-mono text-xs tracking-widest text-gold">
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold" />
              {section.dates}
            </p>
          )}

          <p className="mt-5 font-sans text-sm leading-relaxed text-paper/80 md:text-base">
            {section.description}
          </p>

          <p className="mt-7 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-paper/60">
            <MapPin size={14} className="text-laterite-light" />
            {section.location}
          </p>

          {section.fact && (
            <p className="mt-4 border-l-2 border-gold/70 bg-gold/5 px-4 py-3 font-sans text-sm italic leading-relaxed text-gold-light">
              {section.fact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
