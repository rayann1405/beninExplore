'use client';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ChevronDown, ArrowRight, X } from 'lucide-react';
import { useMapStore } from '@/lib/store';
import { journeyOrder } from '@/lib/data/journeyOrder';
import { INTRO_PORTION, OUTRO_PORTION } from '@/components/scene/journeyPath';
import PlacePanel from './PlacePanel';
import ProgressGauge from './ProgressGauge';
import ModeToggle from './ModeToggle';
import PatternDivider from '../ui/PatternDivider';

// Fixed overlay that sits above the 3D canvas: intro screen, the stop panel
// that crossfades as the camera settles, the outro screen, the progress
// gauge and the journey/free mode toggle. Pointer-events are off on the
// wrapper so wheel/touch reach the ScrollControls div below; interactive
// children re-enable them.
export default function JourneyOverlay() {
  const t = useTranslations('common');
  const { scrollProgress, mode, activePoiIndex, selectedPoiId, setSelectedPoiId, requestJump } =
    useMapStore();

  const introZone = scrollProgress < INTRO_PORTION * 1.5;
  const outroZone = scrollProgress > 1 - OUTRO_PORTION * 1.5;

  const activePoi =
    mode === 'journey'
      ? introZone || outroZone
        ? null
        : journeyOrder[activePoiIndex]
      : journeyOrder.find((p) => p.id === selectedPoiId) ?? null;

  const replay = () => requestJump(0);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Top-right mode toggle */}
      <div className="fixed top-5 right-5 z-40">
        <ModeToggle />
      </div>

      {/* Progress gauge (north top / south bottom) */}
      <ProgressGauge />

      {/* Intro */}
      <AnimatePresence>
        {introZone && mode === 'journey' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-24 text-center"
          >
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-paper max-w-3xl leading-tight mb-4">
              {t('journeyTitle')}
            </h1>
            <p className="font-mono text-sm uppercase tracking-widest text-paper/70 mb-8">
              {t('journeyHint')}
            </p>
            <div className="flex flex-col items-center gap-1 text-paper/60">
              <span className="font-mono text-xs uppercase tracking-widest">{t('journeyScroll')}</span>
              <ChevronDown size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stop panel — crossfades between stops */}
      <AnimatePresence mode="wait">
        {activePoi && (
          <motion.div
            key={activePoi.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed right-4 top-1/2 -translate-y-1/2 lg:right-10 z-40 flex flex-col items-end gap-2"
          >
            {mode === 'free' && (
              <button
                type="button"
                onClick={() => setSelectedPoiId(null)}
                aria-label={t('close')}
                className="pointer-events-auto rounded-full border border-paper/15 bg-ink/80 p-2 text-paper/70 hover:text-paper transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <PlacePanel poi={activePoi} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outro */}
      <AnimatePresence>
        {outroZone && mode === 'journey' && (
          <motion.div
            key="outro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            <div className="max-w-xl bg-ink/85 backdrop-blur-xl border border-paper/10 rounded-2xl p-8 md:p-10 text-center pointer-events-auto">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-paper mb-3">
                {t('journeyOutroTitle')}
              </h2>
              <PatternDivider />
              <p className="text-paper/70 font-sans leading-relaxed mb-8">{t('journeyOutroText')}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={replay}
                  className="px-5 py-3 rounded-full border border-paper/20 text-paper text-sm font-mono hover:border-laterite hover:text-laterite-light transition-colors"
                >
                  {t('journeyReplay')}
                </button>
                <Link
                  href="/a-propos"
                  className="px-5 py-3 rounded-full bg-laterite hover:bg-laterite-light text-paper text-sm font-bold flex items-center gap-2 transition-colors group"
                >
                  {t('journeyOutroCta')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
