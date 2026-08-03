'use client';
import { useTranslations } from 'next-intl';
import { journeyOrder } from '@/lib/data/journeyOrder';
import { categoryConfig } from '@/lib/categories';
import { useMapStore } from '@/lib/store';

// Vertical north->south gauge (north on top). Clicking a dot jumps the
// scroll to that stop; the active stop glows in its category color.
export default function ProgressGauge() {
  const activePoiIndex = useMapStore((s) => s.activePoiIndex);
  const requestJump = useMapStore((s) => s.requestJump);
  const tPoi = useTranslations('poi');

  return (
    <nav
      aria-label="Progression du voyage"
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-none"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-paper/50">
        Nord
      </span>
      <div className="flex flex-col items-center gap-2.5 py-1">
        {journeyOrder.map((poi, i) => {
          const isActive = i === activePoiIndex;
          const color = categoryConfig[poi.category].color;
          return (
            <button
              key={poi.id}
              type="button"
              onClick={() => requestJump(i)}
              aria-current={isActive}
              aria-label={tPoi(`${poi.id}.name`)}
              className="group relative flex items-center py-0.5 pointer-events-auto"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 11 : 6,
                  height: isActive ? 11 : 6,
                  backgroundColor: isActive ? color : 'rgba(242,237,225,0.3)',
                }}
              />
              <span className="pointer-events-none absolute left-5 whitespace-nowrap text-xs font-mono text-paper bg-ink/90 px-2 py-1 rounded border border-paper/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                {tPoi(`${poi.id}.name`)}
              </span>
            </button>
          );
        })}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-paper/50">
        Sud
      </span>
    </nav>
  );
}
