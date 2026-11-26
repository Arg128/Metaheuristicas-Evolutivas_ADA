import { useState } from 'react';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { MathTranslatorToggle } from '../components/interactive/MathTranslatorToggle';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const EQUIVALENCES = [
  {
    bio: 'Selección Natural',
    math: 'Muestreo probabilístico ponderado sobre f(x)',
    symbol: 'P(i) ∝ g(f(xᵢ))',
  },
  {
    bio: 'Mutación y Cruce',
    math: 'Perturbación y mezcla estocástica en espacio G',
    symbol: 'T_var: G² → Δ(G)',
  },
  {
    bio: 'Evolución Poblacional',
    math: 'Cadena de Markov no estacionaria sobre estados',
    symbol: 'P(P^(g+1) | P^(g))',
  },
  {
    bio: 'Adaptación de Rasgos',
    math: 'Amplificación de esquemas (Teorema de Holland)',
    symbol: 'E[m(H, g+1)]',
  },
];

export function Slide07MetaphorVsMath({ meta, totalSlides }: SlideProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(2);

  useSlideKeyboard({
    onNextState: () => setSelectedIdx((prev) => (prev + 1) % EQUIVALENCES.length),
    onPrevState: () =>
      setSelectedIdx((prev) => (prev - 1 + EQUIVALENCES.length) % EQUIVALENCES.length),
    onSelectNumber: (idx) => {
      if (idx < EQUIVALENCES.length) setSelectedIdx(idx);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Detrás de la retórica bio-inspirada, todo algoritmo evolutivo es un proceso estocástico gobernado por operadores y Cadenas de Markov."
    >
      {/* Left 6 Cols: Sörensen / Cruz-Duarte PaperExcerpt + Equivalences */}
      <div className="col-span-6 flex min-h-0 flex-col gap-3">
        <PaperExcerpt
          category="Crítica Formal: Metáfora Expuesta (Sörensen, 2015; Cruz-Duarte et al., 2021)"
          sourceTag="[R8] ITOR · [R10] SWEVO"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(MK)"
        >
          El exceso de metáforas animales oculta la matemática: toda metaheurística se define por sus{' '}
          <PaperTermHighlight>operadores estocásticos</PaperTermHighlight>{' '}
          como una Cadena de Markov sobre distribuciones de probabilidad.
        </PaperExcerpt>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5">
          {EQUIVALENCES.map((item, idx) => (
            <button
              key={item.bio}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`flex flex-1 flex-col justify-center w-full rounded-xl border px-4 py-2.5 text-left transition-colors cursor-pointer ${
                selectedIdx === idx
                  ? 'border-violet-500 bg-violet-50 shadow-xs'
                  : 'border-slate-200 bg-white/95 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-bold text-slate-800">{item.bio}</span>
                <span className="rounded border border-violet-200 bg-violet-50 px-2.5 py-0.5 font-mono text-xs font-bold text-violet-800">
                  {item.symbol}
                </span>
              </div>
              <p className="mt-1 text-[15px] font-semibold text-[#1B365D]">→ {item.math}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right 6 Cols: Interactive MathTranslatorToggle + Literature Evidence Tab */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <MathTranslatorToggle selectedIdx={selectedIdx} onSelectIdx={setSelectedIdx} />
      </div>
    </SlideLayout>
  );
}
