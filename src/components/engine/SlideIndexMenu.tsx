import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import type { SlideMeta, ThematicBlock } from '../../types/presentation';
import { getAccentStyle, getBlockAccent } from '../../utils/accentStyles';

export interface SlideIndexMenuProps {
  isOpen: boolean;
  slides: SlideMeta[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
}

const BLOCK_ORDER: ThematicBlock[] = [
  'Fundamentos y Taxonomía',
  'Operadores Evolutivos',
  'Simulación y Comparativa',
  'Análisis y Límites',
  'Aplicaciones y Cierre',
];

export function SlideIndexMenu({
  isOpen,
  slides,
  currentIndex,
  onSelectSlide,
  onClose,
}: SlideIndexMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/75 p-6 pt-16 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Índice de diapositivas"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[82vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#090d1f]/95 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-50">
                  Índice General de la Presentación
                </h2>
                <p className="text-xs text-slate-400">
                  5 bloques temáticos · {slides.length} diapositivas · Haz clic para navegar
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700/80 bg-slate-900 p-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white cursor-pointer"
                aria-label="Cerrar índice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="custom-scrollbar grid gap-5 overflow-y-auto p-6 md:grid-cols-2">
              {BLOCK_ORDER.map((block) => {
                const blockSlides = slides
                  .map((slide, index) => ({ slide, index }))
                  .filter((item) => item.slide.block === block);
                const accent = getBlockAccent(block);
                const accentStyle = getAccentStyle(accent);

                return (
                  <section
                    key={block}
                    className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${accentStyle.badge}`}
                      >
                        {block}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        {blockSlides.length} {blockSlides.length === 1 ? 'slide' : 'slides'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {blockSlides.map(({ slide, index }) => {
                        const isActive = index === currentIndex;
                        return (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={() => {
                              onSelectSlide(index);
                              onClose();
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${
                              isActive
                                ? `${accentStyle.activeBorder} bg-slate-800/95 text-slate-50`
                                : 'border-transparent bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                          >
                            <span
                              className={`font-mono text-xs font-bold tabular-nums ${
                                isActive ? accentStyle.text : 'text-slate-500'
                              }`}
                            >
                              {String(slide.id).padStart(2, '0')}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                              {slide.title}
                            </span>
                            {isActive ? (
                              <CheckCircle2 className={`h-4 w-4 shrink-0 ${accentStyle.text}`} />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
