import { useTranslations } from 'next-intl';

export default function LoadingScreen() {
  const t = useTranslations('common');
  return (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-background z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-laterite border-t-transparent rounded-full animate-spin"></div>
        <p className="text-paper font-mono uppercase tracking-widest">{t('loading')}</p>
      </div>
    </div>
  );
}
