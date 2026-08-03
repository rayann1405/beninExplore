'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent } from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative">
      <label htmlFor="locale-switcher" className="sr-only">
        {t('language')}
      </label>
      <select
        id="locale-switcher"
        value={locale}
        onChange={onChange}
        className="appearance-none bg-transparent text-paper font-mono text-sm px-2 py-1 border border-paper/20 rounded focus:outline-none focus:ring-2 focus:ring-laterite"
      >
        <option value="fr" className="bg-ink text-paper">FR</option>
        <option value="en" className="bg-ink text-paper">EN</option>
      </select>
    </div>
  );
}
