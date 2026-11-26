import { AnimatePresence, motion } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { GLOBAL_SHORTCUTS, SLIDE_SHORTCUTS } from '../../data/keyboardShortcuts';
import type { SlideMeta } from '../../types/presentation';

export interface ShortcutsLegendModalProps {
  isOpen: boolean;
  currentSlide: SlideMeta;
  slides: SlideMeta[];
  onClose: () => void;
}

export function ShortcutsLegendModal({
  isOpen,
  currentSlide,
  slides,
  onClose,
}: ShortcutsLegendModalProps) {
  const currentShortcuts = SLIDE_SHORTCUTS[currentSlide.id] ?? [];

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/35 p-6 pt-16 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Leyenda de atajos de teclado"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/15 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2E64B5]">
                  <Keyboard className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-black">
                    Leyenda de Atajos de Teclado
                  </h2>
                  <p className="text-xs text-slate-600">
                    Controla estados, tarjetas y simulaciones sin usar el mouse · Se oculta con tecla H o el icono de ojo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                aria-label="Cerrar leyenda de atajos"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="custom-scrollbar space-y-5 overflow-y-auto p-6">
              {/* Current Slide Highlight */}
              {currentShortcuts.length > 0 ? (
                <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E64B5]">
                      Diapositiva actual ({String(currentSlide.id).padStart(2, '0')} · {currentSlide.title})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {currentShortcuts.map((item) => (
                      <div
                        key={item.keys + item.label}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm shadow-2xs"
                      >
                        <kbd className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-black">
                          {item.keys}
                        </kbd>
                        <span className="font-medium text-[#1B365D]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Global Universal Controls */}
              <section>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Atajos Universales (Funcionan en toda la presentación)
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {GLOBAL_SHORTCUTS.map((item) => (
                    <div
                      key={item.keys}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
                    >
                      <kbd className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-xs font-bold text-black shadow-2xs">
                        {item.keys}
                      </kbd>
                      <span className="text-xs font-medium text-slate-800 leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Per-Slide Map */}
              <section>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mapa de Estados por Diapositiva
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {slides
                    .filter((s) => (SLIDE_SHORTCUTS[s.id]?.length ?? 0) > 0)
                    .map((s) => {
                      const items = SLIDE_SHORTCUTS[s.id] ?? [];
                      const isCurrent = s.id === currentSlide.id;
                      return (
                        <div
                          key={s.id}
                          className={`rounded-xl border px-3.5 py-2.5 ${
                            isCurrent
                              ? 'border-[#2E64B5] bg-blue-50/40'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#2E64B5]">
                              {String(s.id).padStart(2, '0')}
                            </span>
                            <span className="truncate text-xs font-bold text-black">
                              {s.title}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((it) => (
                              <span
                                key={it.keys + it.label}
                                className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 ring-1 ring-slate-200"
                              >
                                <kbd className="font-mono font-bold text-black">{it.keys}</kbd>
                                <span>{it.label}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
