import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Épilogue sous la dernière section du parcours (la caméra y reste posée).
export default function Outro() {
  const t = useTranslations('common');

  return (
    <section className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gold">
        {t('journeyOutroTitle')}
      </p>
      <h2 className="mb-8 max-w-2xl font-display text-3xl font-bold text-paper md:text-5xl">
        {t('journeyOutroText')}
      </h2>
      <Link
        href="/a-propos"
        className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:bg-gold/20"
      >
        {t('about')}
      </Link>
    </section>
  );
}
