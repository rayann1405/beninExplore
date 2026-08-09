import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Motif from './Motif';

// Épilogue sous la dernière section du parcours (la caméra y reste posée).
export default function Outro() {
  const t = useTranslations('common');

  return (
    <section className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Motif variant="emblem" className="w-28 text-gold" />
      <p className="mb-5 mt-6 font-mono text-xs uppercase tracking-[0.35em] text-gold">
        {t('journeyOutroTitle')}
      </p>
      <h2 className="max-w-3xl font-display text-3xl leading-[1.1] text-paper md:text-6xl">
        {t('journeyOutroText')}
      </h2>
      <Motif variant="line" className="mt-8 w-72 text-gold/50" />
      <Link
        href="/a-propos"
        className="group relative mt-9 inline-flex items-center gap-3 border border-gold/50 px-8 py-3.5 font-mono text-sm uppercase tracking-[0.25em] text-paper transition-colors duration-300 hover:bg-gold hover:text-ink"
      >
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold transition-colors duration-300 group-hover:bg-ink" />
        {t('about')}
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold transition-colors duration-300 group-hover:bg-ink" />
      </Link>
    </section>
  );
}
