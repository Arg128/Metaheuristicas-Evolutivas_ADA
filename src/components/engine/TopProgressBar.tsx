import { motion } from 'framer-motion';
import { Layers, Maximize2, Minimize2, StickyNote } from 'lucide-react';
import type { SlideMeta } from '../../types/presentation';
import { getAccentStyle, getBlockAccent } from '../../utils/accentStyles';

export interface TopProgressBarProps {
  currentSlide: SlideMeta;
  currentIndex: number;
  totalSlides: number;
  isIndexOpen: boolean;
  isNotesOpen: boolean;
  isFullscreen: boolean;
  onToggleIndex: () => void;
  onToggleNotes: () => void;
  onToggleFullscreen: () => void;
}

export function TopProgressBar({
  currentSlide,
  currentIndex,
  totalSlides,
  isIndexOpen,
  isNotesOpen,
  isFullscreen,
  onToggleIndex,
  onToggleNotes,
  onToggleFullscreen,
}: TopProgressBarProps) {
  const progress = (currentIndex + 1) / Math.max(1, totalSlides);
  const accent = getBlockAccent(currentSlide.block);
  const accentStyle = getAccentStyle(accent);
  const slideStr = String(currentIndex + 1).padStart(2, '0');
  const totalStr = String(totalSlides).padStart(2, '0');

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      {/* Progress Track */}
      <div className="h-1 w-full bg-slate-200/90">
        <motion.div
          className={`h-full origin-left ${accentStyle.trackBg}`}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Top HUD */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          type="button"
          onClick={onToggleIndex}
          className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer ${
            isIndexOpen
              ? `${accentStyle.activeBorder} bg-white text-slate-900`
              : 'border-slate-200 bg-white/90 text-slate-800 shadow-sm shadow-slate-900/5 hover:border-slate-300 hover:bg-white'
          }`}
          title="Abrir índice de diapositivas (I)"
        >
          <Layers className={`h-4 w-4 ${accentStyle.text}`} />
          <span className="font-mono font-semibold tabular-nums text-slate-600">
            {slideStr} / {totalStr}
          </span>
          <span className="text-slate-300">—</span>
          <span className="hidden max-w-[360px] truncate font-semibold text-slate-900 sm:inline">
            {currentSlide.title}
          </span>
          <kbd className="ml-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
            I
          </kbd>
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleNotes}
            className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer ${
              isNotesOpen
                ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-md shadow-amber-900/10'
                : 'border-slate-200 bg-white/90 text-slate-800 shadow-sm shadow-slate-900/5 hover:border-slate-300 hover:bg-white'
            }`}
            title="Notas del expositor y cronómetro (N)"
          >
            <StickyNote className="h-4 w-4" />
            <span className="hidden sm:inline">Notas</span>
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              N
            </kbd>
            {isNotesOpen ? (
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-medium text-slate-800 shadow-sm shadow-slate-900/5 backdrop-blur-md transition-colors hover:border-slate-300 hover:bg-white cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-cyan-700" />
            ) : (
              <Maximize2 className="h-4 w-4 text-slate-600" />
            )}
            <kbd className="hidden rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 sm:inline">
              F
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
