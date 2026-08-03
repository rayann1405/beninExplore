import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <Link href="/" className="pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-2xl text-paper m-0 leading-none">
            Bénin <span className="text-laterite">Explore</span>
          </h1>
          <span className="font-mono text-xs text-paper/70 tracking-widest uppercase mt-1">
            {t('mapSubtitle')}
          </span>
        </div>
      </Link>
      
      <div className="flex items-center gap-6 pointer-events-auto">
        <Link href="/a-propos" className="text-paper hover:text-laterite-light font-sans text-sm transition-colors">
          {t('about')}
        </Link>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
