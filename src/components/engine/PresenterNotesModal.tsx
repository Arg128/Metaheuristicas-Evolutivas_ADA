import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MousePointerClick, Pause, Play, RotateCcw, Target, Timer, X } from 'lucide-react';
import type { SlideMeta } from '../../types/presentation';
import { getAccentStyle, getBlockAccent } from '../../utils/accentStyles';

export interface PresenterNotesModalProps {
  isOpen: boolean;
  slide: SlideMeta;
  totalSlides: number;
  onClose: () => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function PresenterNotesModal({
  isOpen,
  slide,
  totalSlides,
  onClose,
}: PresenterNotesModalProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning]);

  const accent = getBlockAccent(slide.block);
  const accentStyle = getAccentStyle(accent);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          role="dialog"
          aria-modal="false"
          aria-label="Notas del expositor"
          initial={{ x: 460, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 460, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-14 right-4 bottom-16 z-50 flex w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-amber-400/35 bg-[#090d1f]/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${accentStyle.badge}`}
                >
                  {slide.block}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {String(slide.id).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                </span>
              </div>
              <h2 className="truncate text-base font-bold text-slate-50">{slide.title}</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700/80 bg-slate-900 p-1.5 text-slate-300 transition-colors hover:border-slate-500 hover:text-white cursor-pointer"
              aria-label="Cerrar notas del expositor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Presentation Timer */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-5 py-2.5">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-medium text-slate-300">Cronómetro</span>
              <span className="ml-1 font-mono text-base font-bold tabular-nums text-amber-200">
                {formatDuration(elapsedSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs font-medium text-slate-100 transition-colors hover:border-amber-400/50 hover:text-amber-200 cursor-pointer"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Iniciar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setElapsedSeconds(0);
                }}
                className="flex items-center rounded-lg border border-slate-700 bg-slate-800/90 p-1.5 text-slate-300 transition-colors hover:border-slate-500 hover:text-white cursor-pointer"
                title="Reiniciar cronómetro"
                aria-label="Reiniciar cronómetro"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Presenter Content */}
          <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-5">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <Target className="h-3.5 w-3.5" />
                <span>Objetivo Pedagógico</span>
              </div>
              <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm leading-relaxed text-slate-200">
                {slide.pedagogicalGoal}
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                Guion del Expositor (Solo visible con tecla N)
              </div>
              <div className="rounded-xl border border-amber-400/25 bg-amber-500/5 p-4">
                <p className="text-base leading-relaxed font-normal text-slate-50 whitespace-pre-line">
                  {slide.speakerScript}
                </p>
              </div>
            </div>

            {slide.interactionHint ? (
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  <span>Sugerencia de Interacción en Vivo</span>
                </div>
                <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm leading-relaxed text-emerald-100">
                  {slide.interactionHint}
                </p>
              </div>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
