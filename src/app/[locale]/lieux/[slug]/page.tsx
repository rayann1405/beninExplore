import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { poiData } from '@/lib/data/poi';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import GeometricGlyph from '@/components/ui/GeometricGlyph';
import PatternDivider from '@/components/ui/PatternDivider';
import { categoryConfig } from '@/lib/categories';

import PlaceSceneWrapper from '@/components/scene/PlaceSceneWrapper';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    poiData.forEach(poi => {
      params.push({ locale, slug: poi.id });
    });
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{locale: string, slug: string}> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'poi' });
  const poi = poiData.find(p => p.id === slug);
  
  if (!poi) return {};

  return {
    title: `${t(`${slug}.name`)} | Bénin Explore`,
    description: t(`${slug}.tagline`),
  };
}

export default async function PlacePage({ params }: { params: Promise<{locale: string, slug: string}> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const poi = poiData.find(p => p.id === slug);
  if (!poi) notFound();

  const tPoi = await getTranslations('poi');
  const tCat = await getTranslations('categories');
  const tReg = await getTranslations('regions');
  const tCommon = await getTranslations('common');

  const color = categoryConfig[poi.category].color;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pt-20">
      {/* 3D Scene / Visual half */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen sticky top-0 bg-ink relative">
        <PlaceSceneWrapper poi={poi} />
        
        <Link 
          href="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-paper hover:text-laterite hover:bg-background transition-colors text-sm font-mono border border-paper/10"
        >
          <ArrowLeft size={16} />
          {tCommon('backToMap')}
        </Link>
        
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
          <GeometricGlyph category={poi.category} />
        </div>
      </div>

      {/* Content half */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:h-screen overflow-y-auto p-8 md:p-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-4 border"
              style={{
                color: color,
                borderColor: `${color}40`,
                backgroundColor: `${color}10`
              }}
            >
              {tCat(poi.category)} • {tReg(poi.region)}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-paper mb-4 leading-tight">
              {tPoi(`${poi.id}.name`)}
            </h1>
            <p className="text-xl text-laterite-light font-sans font-medium">
              {tPoi(`${poi.id}.tagline`)}
            </p>
          </div>

          <PatternDivider color={color} />

          <div className="prose prose-invert prose-lg my-12">
            <p className="text-paper/80 leading-relaxed font-sans">
              {tPoi(`${poi.id}.description`)}
            </p>
          </div>

          <div className="bg-ink p-6 rounded-xl border border-paper/5 mb-12">
            <h2 className="text-paper font-mono text-xs uppercase tracking-widest mb-3 opacity-60">
              Fait marquant
            </h2>
            <p className="text-gold font-sans text-lg">{tPoi(`${poi.id}.fact`)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm font-mono text-paper/60 mb-12">
            <div className="bg-ink p-4 rounded border border-paper/5">
              <span className="block opacity-50 mb-1">{tCommon('region')}</span>
              <span className="text-paper">{tReg(poi.region)}</span>
            </div>
            <div className="bg-ink p-4 rounded border border-paper/5">
              <span className="block opacity-50 mb-1">{tCommon('category')}</span>
              <span className="text-paper">{tCat(poi.category)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
