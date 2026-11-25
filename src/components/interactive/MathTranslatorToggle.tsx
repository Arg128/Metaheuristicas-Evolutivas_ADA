import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Dna, FunctionSquare } from 'lucide-react';
import { MathFormula } from '../ui/MathFormula';
import { ParameterSlider } from '../ui/ParameterSlider';

export interface MathTranslatorToggleProps {
  selectedIdx: number;
  onSelectIdx: (idx: number) => void;
}

interface TranslationCard {
  bioTitle: string;
  bioDesc: string;
  mathTitle: string;
  mathDesc: string;
  tex: string;
}

const CARDS: TranslationCard[] = [
  {
    bioTitle: 'Selección Natural',
    bioDesc: 'Supervivencia y reproducción preferencial de los individuos mejor adaptados al entorno.',
    mathTitle: 'Muestreo Probabilístico Ponderado',
    mathDesc: 'Distribución discreta inducida sobre la población actual proporcional o ordinal respecto a f(x).',
    tex: 'P(i) = \\frac{g(f(\\mathbf{x}_i))}{\\sum_{j=1}^N g(f(\\mathbf{x}_j))}',
  },
  {
    bioTitle: 'Mutación y Cruce',
    bioDesc: 'Recombinación genética de cromosomas parentales y alteraciones aleatorias en genes.',
    mathTitle: 'Operadores Estocásticos en Espacios Vectoriales',
    mathDesc: 'Transformaciones aleatorias de mezcla convexa y perturbación gaussiana/bit-flip en G.',
    tex: '\\mathbf{x}\' = \\alpha\\mathbf{p}_1 + (1-\\alpha)\\mathbf{p}_2 + \\mathcal{N}(\\mathbf{0}, \\sigma^2\\mathbf{I})',
  },
  {
    bioTitle: 'Evolución de Población',
    bioDesc: 'Sucesión de generaciones biológicas que acumulan adaptaciones a lo largo del tiempo.',
    mathTitle: 'Cadena de Markov No Estacionaria',
    mathDesc: 'El estado P^(g+1) depende únicamente de P^(g) mediante núcleos de transición estocásticos.',
    tex: '\\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}, \\dots, P^{(0)}\\right) = \\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}\\right)',
  },
  {
    bioTitle: 'Adaptación de Rasgos',
    bioDesc: 'Preservación y proliferación de características favorables heredadas en la especie.',
    mathTitle: 'Teorema del Esquema de Holland',
    mathDesc: 'Crecimiento exponencial esperado de hiperplanos de bajo orden y corta longitud definitoria.',
    tex: '\\mathbb{E}[m(H, g+1)] \\ge m(H,g)\\frac{\\bar{f}(H)}{\\bar{f}}\\left[1 - p_c\\frac{\\delta(H)}{L-1} - o(H)p_m\\right]',
  },
];

export function MathTranslatorToggle({
  selectedIdx,
  onSelectIdx,
}: MathTranslatorToggleProps) {
  // 0 = pure biological metaphor, 100 = full mathematical rigor
  const [rigorLevel, setRigorLevel] = useState<number>(100);
  const isMath = rigorLevel >= 50;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Animated Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Traductor Conceptual Interactivo
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            {isMath ? 'Rigor Matemático Estocástico' : 'Metáfora Biológica Clásica'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setRigorLevel(isMath ? 0 : 100)}
          onKeyDown={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            isMath
              ? 'border-violet-400 bg-violet-500/20 text-violet-100'
              : 'border-amber-400 bg-amber-500/20 text-amber-100'
          }`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {isMath ? 'Metáfora Biológica' : 'Rigor Matemático'}
        </button>
      </div>

      {/* Slider */}
      <ParameterSlider
        label="Metáfora Biológica ↔ Rigor Matemático"
        value={rigorLevel}
        min={0}
        max={100}
        step={50}
        accent={isMath ? 'violet' : 'amber'}
        formatValue={(v) => (v >= 50 ? 'Rigor Formal (100%)' : 'Metáfora Bio (0%)')}
        onChange={setRigorLevel}
      />

      {/* 4 Core Translated Cards */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5">
        {CARDS.map((card, idx) => {
          const active = selectedIdx === idx;
          return (
            <motion.button
              key={card.bioTitle}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => onSelectIdx(idx)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                active
                  ? isMath
                    ? 'border-violet-400 bg-violet-500/14 shadow-[0_0_18px_rgba(167,139,250,0.2)]'
                    : 'border-amber-400 bg-amber-500/12 shadow-[0_0_18px_rgba(251,191,36,0.16)]'
                  : 'border-slate-800 bg-slate-950/75 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      isMath ? 'text-violet-300' : 'text-amber-300'
                    }`}
                  >
                    {isMath ? (
                      <FunctionSquare className="h-3.5 w-3.5" />
                    ) : (
                      <Dna className="h-3.5 w-3.5" />
                    )}
                    {isMath ? 'Operador Formal' : 'Analogía Bio'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">0{idx + 1}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMath ? `math-${idx}` : `bio-${idx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h4 className="text-sm font-bold text-slate-100">
                      {isMath ? card.mathTitle : card.bioTitle}
                    </h4>
                    <p className="mt-1 text-[11px] leading-snug text-slate-300">
                      {isMath ? card.mathDesc : card.bioDesc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-2 overflow-hidden rounded-lg border border-slate-800/90 bg-[#050816] px-2 py-1.5 text-center text-[11px]">
                <MathFormula tex={card.tex} className="text-violet-200" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
