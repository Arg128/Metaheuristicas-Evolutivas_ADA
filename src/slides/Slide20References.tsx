import { useState } from 'react';
import { BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { REFERENCES } from '../data/references';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta, SpeakerId } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

type FilterOption = 'all' | SpeakerId;

const BLOCK_FILTERS: { id: FilterOption; label: string }[] = [
  { id: 'all', label: `Todas (${REFERENCES.length})` },
  { id: 'Maritza', label: '01–05 · Fundamentos' },
  { id: 'Fredy', label: '06–10 · Operadores' },
  { id: 'Jhoans', label: '11–14 · Simulación' },
  { id: 'Ángel', label: '15–19 · Límites y Casos' },
];

export function Slide20References({ meta, totalSlides }: SlideProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const filterIds = BLOCK_FILTERS.map((f) => f.id);

  useSlideKeyboard({
    onNextState: () =>
      setFilter((prev) => filterIds[(filterIds.indexOf(prev) + 1) % filterIds.length]),
    onPrevState: () =>
      setFilter(
        (prev) => filterIds[(filterIds.indexOf(prev) - 1 + filterIds.length) % filterIds.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < filterIds.length) setFilter(filterIds[idx]);
    },
  });

  const visibleRefs =
    filter === 'all'
      ? REFERENCES
      : REFERENCES.filter((ref) => ref.speakerGroup === filter);

  const isFiltered = filter !== 'all';

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="¡Gracias por su atención! Grupo 7 · Análisis y Diseño de Algoritmos — UNSA. Preguntas y demostración en vivo disponibles."
    >
      {/* Top Filter Bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm shadow-slate-900/5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#2E64B5]" />
          <span className="text-sm font-bold text-black">
            Filtrar por Bloque:
          </span>
          <div className="flex items-center gap-1.5">
            {BLOCK_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                onKeyDown={(e) => e.stopPropagation()}
                className={`rounded-lg border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'border-[#2E64B5] bg-[#2E64B5] text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-black'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
          <Sparkles className="h-3.5 w-3.5" />
          ¡Gracias por su atención! · Grupo 7 UNSA
        </span>
      </div>

      {/* References Grid */}
      <div
        className={`min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar ${
          isFiltered
            ? 'grid grid-cols-2 gap-3.5 content-start'
            : 'grid grid-cols-3 gap-1.5 content-start'
        }`}
      >
        {visibleRefs.map((refItem) => {
          const href = refItem.doi
            ? `https://doi.org/${refItem.doi}`
            : refItem.url;

          return (
            <div
              key={refItem.id}
              className={`rounded-xl border border-slate-200 bg-white/95 shadow-xs transition-colors hover:border-[#2E64B5]/45 ${
                isFiltered ? 'p-4' : 'px-3 py-1.5'
              }`}
            >
              <div className={`flex flex-wrap items-baseline gap-1 ${isFiltered ? 'text-base' : 'text-[12.5px]'} leading-tight`}>
                <span className="font-mono font-bold text-[#2E64B5]">
                  [{refItem.id}]
                </span>
                <span className="font-bold text-black">
                  {refItem.authors} ({refItem.year}).
                </span>
                <span className="font-medium text-[#1B365D]">
                  {refItem.title}.
                </span>
              </div>

              <div className={`${isFiltered ? 'mt-1.5 text-sm' : 'mt-0.5 text-[11.5px]'} flex flex-wrap items-center gap-1.5 text-slate-600`}>
                <span className="italic">{refItem.venue}</span>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-0.5 font-mono font-semibold text-[#2E64B5] hover:underline"
                  >
                    {refItem.doi ? `doi:${refItem.doi}` : 'Enlace'}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </SlideLayout>
  );
}
