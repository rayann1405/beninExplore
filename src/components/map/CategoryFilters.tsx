'use client';
import { useTranslations } from 'next-intl';
import { categoryConfig } from '@/lib/categories';
import { useMapStore } from '@/lib/store';
import { Leaf, Users, BookOpen, Building, Landmark, Map as MapIcon } from 'lucide-react';

const icons = {
  Leaf, Users, BookOpen, Building, Landmark
};

type CategoryKey = keyof typeof categoryConfig;

export default function CategoryFilters() {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const { selectedCategory, setSelectedCategory, requestJump } = useMapStore();

  const scrollToStart = () => {
    setSelectedCategory(null);
    requestJump(-1);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 bg-ink/80 backdrop-blur-md p-2 rounded-full border border-paper/10 shadow-xl pointer-events-auto">
      <button
        onClick={scrollToStart}
        className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-sans text-paper hover:bg-paper/10 transition-all"
      >
        <MapIcon size={16} />
        <span className="hidden sm:inline">{tCommon('overview')}</span>
      </button>

      <div className="w-px h-6 bg-paper/20 mx-1"></div>

      {Object.entries(categoryConfig).map(([key, config]) => {
        const Icon = icons[config.icon as keyof typeof icons];
        const isSelected = selectedCategory === key;

        return (
          <button
            key={key}
            onClick={() => setSelectedCategory(isSelected ? null : key)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-sans transition-all
              ${isSelected ? 'text-ink font-bold shadow-lg' : 'text-paper hover:bg-paper/10'}
            `}
            style={{
              backgroundColor: isSelected ? config.color : 'transparent',
            }}
            aria-pressed={isSelected}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{t(key as CategoryKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
