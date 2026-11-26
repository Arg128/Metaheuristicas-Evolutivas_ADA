import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Keyboard, Layers, Maximize2, Minimize2, StickyNote } from 'lucide-react';
import { SLIDE_SHORTCUTS } from '../../data/keyboardShortcuts';
import type { SlideMeta } from '../../types/presentation';
import { getAccentStyle, getBlockAccent } from '../../utils/accentStyles';

export interface TopProgressBarProps {
  currentSlide: SlideMeta;
  currentIndex: number;
  totalSlides: number;
  isIndexOpen: boolean;
  isNotesOpen: boolean;
  isShortcutsOpen: boolean;
  isFullscreen: boolean;
  isHudVisible: boolean;
  onToggleIndex: () => void;
  onToggleNotes: () => void;
  onToggleShortcuts: () => void;
  onToggleFullscreen: () => void;
  onToggleHud: () => void;
}

export function TopProgressBar({
  currentSlide,
  currentIndex,
  totalSlides,
  isIndexOpen,
  isNotesOpen,
  isShortcutsOpen,
  isFullscreen,
  isHudVisible,
  onToggleIndex,
  onToggleNotes,
  onToggleShortcuts,
  onToggleFullscreen,
  onToggleHud,
}: TopProgressBarProps) {
  const progress = (currentIndex + 1) / Math.max(1, totalSlides);
  const accent = getBlockAccent(currentSlide.block);
  const accentStyle = getAccentStyle(accent);
  const slideStr = String(currentIndex + 1).padStart(2, '0');
  const totalStr = String(totalSlides).padStart(2, '0');
  const currentShortcuts = SLIDE_SHORTCUTS[currentSlide.id] ?? [];

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
      <div className="flex items-center justify-between gap-3 px-5 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <AnimatePresence>
            {isHudVisible ? (
              <motion.button
                key="hud-index"
                type="button"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
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
                <span className="hidden max-w-[260px] truncate font-semibold text-slate-900 lg:inline">
                  {currentSlide.title}
                </span>
                <kbd className="ml-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                  I
                </kbd>
              </motion.button>
            ) : null}
          </AnimatePresence>

          {/* Live Contextual Keyboard Legend for Current Slide (hides with H / Eye) */}
          <AnimatePresence>
            {isHudVisible && currentShortcuts.length > 0 ? (
              <motion.button
                key={`hud-hints-${currentSlide.id}`}
                type="button"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                onClick={onToggleShortcuts}
                className="pointer-events-auto hidden items-center gap-2 rounded-xl border border-blue-200/80 bg-white/90 px-3 py-1.5 text-xs text-slate-700 shadow-sm shadow-slate-900/5 backdrop-blur-md transition-colors hover:border-[#2E64B5] hover:bg-white xl:flex cursor-pointer"
                title="Ver todos los atajos de teclado (K)"
              >
                <Keyboard className="h-3.5 w-3.5 shrink-0 text-[#2E64B5]" />
                {currentShortcuts.map((item, idx) => (
                  <span key={item.keys + item.label} className="inline-flex items-center gap-1.5">
                    {idx > 0 ? <span className="text-slate-300">·</span> : null}
                    <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-black">
                      {item.keys}
                    </kbd>
                    <span className="max-w-[210px] truncate font-medium text-[#1B365D]">
                      {item.label}
                    </span>
                  </span>
                ))}
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <AnimatePresence>
            {isHudVisible ? (
              <motion.div
                key="hud-right-controls"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={onToggleShortcuts}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer ${
                    isShortcutsOpen
                      ? 'border-[#2E64B5] bg-blue-50 text-[#2E64B5] shadow-md shadow-blue-900/10'
                      : 'border-slate-200 bg-white/90 text-slate-800 shadow-sm shadow-slate-900/5 hover:border-slate-300 hover:bg-white'
                  }`}
                  title="Leyenda de atajos de teclado (K)"
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Atajos</span>
                  <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    K
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={onToggleNotes}
                  className={`relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer ${
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
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Toggle HUD visibility (always reachable discreetly when hidden) */}
          <button
            type="button"
            onClick={onToggleHud}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-medium backdrop-blur-md transition-all cursor-pointer ${
              isHudVisible
                ? 'border-slate-200 bg-white/90 text-slate-700 shadow-sm shadow-slate-900/5 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                : 'border-slate-200/70 bg-white/60 text-slate-500 opacity-30 hover:opacity-100 hover:bg-white hover:text-slate-900'
            }`}
            title={
              isHudVisible
                ? 'Ocultar controles superiores (H)'
                : 'Mostrar controles superiores (H)'
            }
            aria-label={
              isHudVisible
                ? 'Ocultar controles superiores'
                : 'Mostrar controles superiores'
            }
          >
            {isHudVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {isHudVisible ? (
              <kbd className="hidden rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 sm:inline">
                H
              </kbd>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
}
