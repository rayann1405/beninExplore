import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-paper/5 px-6 py-4 md:px-10">
      <Link href="/" className="pointer-events-auto group flex items-center gap-3.5">
        <span className="grid h-8 w-8 place-items-center border border-gold/40">
          <span className="h-2.5 w-2.5 rotate-45 border border-gold transition-transform duration-300 group-hover:rotate-[135deg]" />
        </span>
        <span className="flex flex-col">
          <span className="font-display text-2xl leading-none tracking-wide text-paper">
            Bénin <span className="text-gold">Explore</span>
          </span>
          <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
            {t('mapSubtitle')}
          </span>
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          href="/a-propos"
          className="pointer-events-auto font-sans text-sm text-paper/80 transition-colors hover:text-gold-light"
        >
          {t('about')}
        </Link>
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
