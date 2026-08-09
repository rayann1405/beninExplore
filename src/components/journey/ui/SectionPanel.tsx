import { MapPin, CalendarDays, Sparkles } from 'lucide-react';
import type { JourneySection } from '@/lib/data/journey';
import SplitTitle from './SplitTitle';

// Bloc texte d'une étape du parcours : type, titre animé, accroche,
// description, dates récurrentes (événements), lieu et fait marquant.
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

  return (
    <div className="max-w-lg rounded-2xl border border-paper/10 bg-ink/70 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gold">
        <span className="text-paper/50">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="h-px w-8 bg-gold/50" />
        <span className="flex items-center gap-1.5">
          {isEvent ? <CalendarDays size={13} /> : <Sparkles size={13} />}
          {isEvent ? 'Événement' : 'Monument'}
        </span>
      </div>

      <SplitTitle text={section.name} className="font-display text-3xl font-bold text-paper md:text-5xl" />

      <p className="mt-4 font-sans text-lg font-medium text-laterite-light">{section.tagline}</p>

      {section.dates && (
        <p className="mt-3 inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
          {section.dates}
        </p>
      )}

      <p className="mt-4 font-sans text-sm leading-relaxed text-paper/75 md:text-base">
        {section.description}
      </p>

      <p className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
        <MapPin size={14} className="text-laterite" />
        {section.location}
      </p>

      {section.fact && (
        <p className="mt-4 border-l-2 border-gold/60 pl-3 font-sans text-sm italic text-gold/90">
          {section.fact}
        </p>
      )}
    </div>
  );
}
