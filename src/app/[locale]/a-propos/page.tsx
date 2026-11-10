import { setRequestLocale, getTranslations } from 'next-intl/server';
import Motif from '@/components/journey/ui/Motif';

export default async function AboutPage({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('common');
  const tAbout = await getTranslations('about');

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-3xl text-paper">
        <div className="flex items-center gap-5">
          <Motif variant="emblem" className="w-16 shrink-0 text-gold" />
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
              {tCommon('about')} — <span className="text-gold">Bénin Explore</span>
            </h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
              {tCommon('mapSubtitle')}
            </p>
          </div>
        </div>
        <Motif variant="rule" className="mt-8 w-full" />

        <div className="relative mt-10 overflow-hidden border border-gold/25 bg-gradient-to-br from-ink/85 via-ink/70 to-transparent">
          <div aria-hidden className="pointer-events-none absolute inset-[5px] border border-gold/15" />
          <div aria-hidden className="bo-hun-band h-[2.5px] w-full" />
          <div aria-hidden className="weave-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="relative space-y-7 p-8 md:p-12">
            <p className="font-sans text-[15px] leading-[1.9] text-paper/80">
              {tAbout('intro')}
            </p>
            <p className="font-sans text-[15px] leading-[1.9] text-paper/80">
              {tAbout('design')}
            </p>
            <div className="flex items-center gap-4 border-t border-gold/15 pt-5">
              <Motif variant="sun" className="h-4 w-4 text-gold" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/60">
                {tAbout('stack')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
