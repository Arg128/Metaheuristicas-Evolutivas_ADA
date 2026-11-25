import { useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { MathTranslatorToggle } from '../components/interactive/MathTranslatorToggle';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const EQUIVALENCES = [
  {
    bio: 'Selección Natural / Supervivencia del más apto',
    math: 'Muestreo probabilístico ponderado sobre distribución empírica de aptitud',
    symbol: 'P(i) ∝ g(f(xᵢ))',
  },
  {
    bio: 'Mutación y Cruce Cromosómico',
    math: 'Operadores estocásticos de perturbación y mezcla en espacios discreto o ℝᴰ',
    symbol: 'T_var: G² → Δ(G)',
  },
  {
    bio: 'Evolución de la Población',
    math: 'Cadena de Markov no estacionaria sobre estados finitos o medibles',
    symbol: 'P(P^(g+1) | P^(g))',
  },
  {
    bio: 'Adaptación de Rasgos',
    math: 'Amplificación esperada de bloques según el Teorema del Esquema de Holland',
    symbol: 'E[m(H, g+1)]',
  },
];

export function Slide07MetaphorVsMath({ meta, totalSlides }: SlideProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(2);

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Detrás de la retórica bio-inspirada, todo algoritmo evolutivo es un proceso estocástico formal analizable mediante distribuciones y Cadenas de Markov."
    >
      {/* Left 6 Cols: Constructive Critique + Equivalences */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Crítica Constructiva a la Retórica Biológica"
          subtitle="Rigor algorítmico frente a metáforas excesivas"
          badge="Postura UNSA"
          icon={<BookOpenCheck className="h-5 w-5" />}
          accent="violet"
          active
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            La metáfora darwiniana inspiró el diseño inicial, pero el exceso de analogías oculta lo esencial: un AE es un{' '}
            <strong className="text-violet-200">optimizador iterativo estocástico</strong> sin magia biológica, gobernado por convergencia en probabilidad y varianza muestral.
          </p>
        </InteractiveCard>

        <div className="space-y-2">
          {EQUIVALENCES.map((item, idx) => (
            <button
              key={item.bio}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`w-full rounded-xl border px-4 py-2 text-left transition-colors cursor-pointer ${
                selectedIdx === idx
                  ? 'border-violet-400 bg-violet-500/15'
                  : 'border-slate-800 bg-slate-900/75 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-300">{item.bio}</span>
                <span className="rounded bg-slate-950/90 px-2 py-0.5 font-mono text-[11px] text-violet-300">
                  {item.symbol}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-100">→ {item.math}</p>
            </button>
          ))}
        </div>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="violet"
          />
        ) : null}
      </div>

      {/* Right 6 Cols: Interactive MathTranslatorToggle */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <MathTranslatorToggle selectedIdx={selectedIdx} onSelectIdx={setSelectedIdx} />
      </div>
    </SlideLayout>
  );
}
