'use client';
import { useTranslations } from 'next-intl';
import { PointOfInterestBase } from '@/lib/data/poi';
import { categoryConfig } from '@/lib/categories';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import PatternDivider from '../ui/PatternDivider';

// The fixed content card shown over the 3D journey — one instance, whose
// contents crossfade as the camera settles on each stop (kodeclubs style).
export default function PlacePanel({ poi }: { poi: PointOfInterestBase }) {
  const tPoi = useTranslations('poi');
  const tCat = useTranslations('categories');
  const tReg = useTranslations('regions');
  const tCommon = useTranslations('common');
  const color = categoryConfig[poi.category].color;

  return (
    <div className="w-[min(92vw,380px)] lg:w-[400px] bg-ink/85 backdrop-blur-xl border border-paper/10 rounded-2xl p-5 md:p-6 shadow-2xl pointer-events-auto">
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3 border"
        style={{
          color,
          borderColor: `${color}40`,
          backgroundColor: `${color}10`,
        }}
      >
        {tCat(poi.category)} • {tReg(poi.region)}
      </span>

      <h2 className="text-2xl md:text-3xl font-display font-bold text-paper mb-1 leading-tight">
        {tPoi(`${poi.id}.name`)}
      </h2>
      <p className="text-laterite-light text-base font-sans">{tPoi(`${poi.id}.tagline`)}</p>

      <PatternDivider color={color} />

      <p className="text-paper/80 leading-relaxed font-sans text-sm mb-4">
        {tPoi(`${poi.id}.description`)}
      </p>

      <div className="bg-background/50 p-4 rounded-lg border border-paper/5 mb-4">
        <h3 className="text-paper font-mono text-xs uppercase tracking-widest mb-2 opacity-60">
          {tCommon('keyFact')}
        </h3>
        <p className="text-gold font-sans text-sm">{tPoi(`${poi.id}.fact`)}</p>
      </div>

      <Link
        href={`/lieux/${poi.id}`}
        className="inline-flex items-center gap-2 text-paper font-bold hover:text-laterite-light transition-colors group text-sm"
      >
        {tCommon('discoverPlace')}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
