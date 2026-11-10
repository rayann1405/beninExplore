import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { JourneySection } from '@/lib/data/journey';
import { ACCENT_STYLES, JOURNEY_TYPE_META } from './typeMeta';
import { paletteFor } from '../decor/palette';
import SplitTitle from './SplitTitle';
import Motif from './Motif';

const pad = (n: number) => String(n).padStart(2, '0');

// Plaque de musée : fiche épurée façon cartel d'exposition — cadre or fin à
// double filet, fond de laiton patiné, bande d'accent de la couleur du lieu en
// tête, numéro de registre « 01 / 06 » et catégorie en en-tête, titre serif,
// filet d'archive, dates en ligne de provenance, description au corps généreux,
// pied de localisation et encart « À SAVOIR » façon note de musée. L'accent du
// lieu (cotonou, abomey, ouidah, ganvie, porto-novo) rythme la plaque sans la
// surcharger — le drapeau reste réservé à l'UI.
export default function SectionPanel({
  section,
  index,
  total,
}: {
  section: JourneySection;
  index: number;
  total: number;
}) {
  const t = useTranslations('common');
  const tJourney = useTranslations('journey');
  const meta = JOURNEY_TYPE_META[section.type];
  const Icon = meta.icon;
  const accent = ACCENT_STYLES[meta.accent];
  const place = paletteFor(section.palette);

  return (
    <div className="relative max-w-xl">
      <div className="relative overflow-hidden border border-gold/30 bg-gradient-to-b from-[#191208] via-[#110C05] to-[#0D0905] backdrop-blur-md">
        {/* double filet intérieur — cadre d'exposition */}
        <div aria-hidden className="pointer-events-none absolute inset-[6px] border border-gold/15" />
        {/* bande d'accent du lieu */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2.5px]"
          style={{ backgroundColor: place.accent }}
        />
        {/* lueur de patine laiton */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(221,163,60,0.08),transparent_60%)]"
        />

        <div className="relative p-8 md:p-11">
          {/* registre + catégorie */}
          <div className="flex items-center justify-between gap-4 border-b border-gold/15 pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
              <span className="text-gold">{pad(index + 1)}</span>
              <span className="text-paper/30"> / {pad(total)}</span>
            </p>
            <span
              className={`inline-flex items-center gap-2 border bg-ink/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] ${accent.text} ${accent.border}`}
            >
              <Icon size={12} />
              {tJourney(`types.${section.type}`)}
            </span>
          </div>

          <div className="mt-7">
            <SplitTitle
              text={tJourney(`sections.${section.id}.name`)}
              className="font-display text-4xl font-semibold leading-[1.04] tracking-tight text-paper md:text-[3.4rem]"
            />
          </div>

          <p className={`mt-3 font-sans text-lg font-medium ${accent.text}`}>
            {tJourney(`sections.${section.id}.tagline`)}
          </p>

          <Motif variant="rule" className="mt-6 w-72" />

          {/* dates — ligne de provenance */}
          {section.dates && (
            <p className="mt-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              <span aria-hidden className="h-px w-6 bg-gold/50" />
              <Motif variant="sun" className="h-3 w-3 text-gold" />
              {tJourney(`sections.${section.id}.dates`)}
            </p>
          )}

          <p className="mt-5 font-sans text-sm leading-[1.85] text-paper/80 md:text-[15px]">
            {tJourney(`sections.${section.id}.description`)}
          </p>

          {/* pied — localisation */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-gold/15 pt-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center border border-gold/30">
                <MapPin size={12} className="text-gold" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/70">
                {tJourney(`sections.${section.id}.location`)}
              </p>
            </div>
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: place.accent }}
            />
          </div>

          {section.fact && (
            <figure className="relative mt-5 border border-gold/20 bg-gold/[0.05] px-4 py-3.5">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{ backgroundColor: place.accent }}
              />
              <figcaption
                className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] ${accent.text}`}
              >
                <Motif variant="sun" className="h-2.5 w-2.5" />
                {t('factLabel')}
              </figcaption>
              <p className="mt-2 font-sans text-sm leading-relaxed text-paper/80">
                {tJourney(`sections.${section.id}.fact`)}
              </p>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}
