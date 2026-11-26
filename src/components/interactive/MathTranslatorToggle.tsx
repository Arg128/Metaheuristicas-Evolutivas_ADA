import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, BookImage, Dna, FunctionSquare } from 'lucide-react';
import { useSlideKeyboard } from '../../hooks/useSlideKeyboard';
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
    bioDesc: 'Supervivencia preferencial de los individuos más aptos.',
    mathTitle: 'Muestreo Ponderado',
    mathDesc: 'Distribución discreta inducida por la aptitud escalar f(x).',
    tex: 'P(i) = \\frac{g(f(\\mathbf{x}_i))}{\\sum_{j=1}^N g(f(\\mathbf{x}_j))}',
  },
  {
    bioTitle: 'Mutación y Cruce',
    bioDesc: 'Recombinación genética y alteraciones aleatorias de genes.',
    mathTitle: 'Operadores Vectoriales',
    mathDesc: 'Mezcla convexa y perturbación gaussiana/bit-flip en G.',
    tex: '\\mathbf{x}\' = \\alpha\\mathbf{p}_1 + (1-\\alpha)\\mathbf{p}_2 + \\mathcal{N}(\\mathbf{0}, \\sigma^2\\mathbf{I})',
  },
  {
    bioTitle: 'Evolución Poblacional',
    bioDesc: 'Sucesión biológica que acumula adaptaciones en el tiempo.',
    mathTitle: 'Cadena de Markov',
    mathDesc: 'El estado P^(g+1) depende solo de P^(g) vía núcleo estocástico.',
    tex: '\\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}\\right)',
  },
  {
    bioTitle: 'Adaptación de Rasgos',
    bioDesc: 'Proliferación de características favorables heredadas.',
    mathTitle: 'Teorema del Esquema',
    mathDesc: 'Crecimiento esperado de hiperplanos de bajo orden.',
    tex: '\\mathbb{E}[m(H, g+1)] \\ge m(H,g)\\frac{\\bar{f}(H)}{\\bar{f}}\\left[1 - \\dots\\right]',
  },
];

export function MathTranslatorToggle({
  selectedIdx,
  onSelectIdx,
}: MathTranslatorToggleProps) {
  const [rigorLevel, setRigorLevel] = useState<number>(100);
  const [tab, setTab] = useState<'translator' | 'evidence'>('translator');
  const isMath = rigorLevel >= 50;

  useSlideKeyboard({
    onAction: () => {
      if (tab === 'evidence') setTab('translator');
      setRigorLevel((v) => (v >= 50 ? 0 : 100));
    },
    onToggleView: () => setTab((t) => (t === 'translator' ? 'evidence' : 'translator')),
  });

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Mode / Literature Tab */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
            {tab === 'evidence' ? 'Evidencia en Literatura' : 'Traductor Interactivo'}
          </span>
          <h3 className="truncate text-lg font-bold text-black">
            {tab === 'evidence'
              ? 'EC-Bestiary vs. Enfoque Modular'
              : isMath
                ? 'Rigor Matemático Estocástico'
                : 'Metáfora Biológica Clásica'}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {tab === 'translator' ? (
            <button
              type="button"
              onClick={() => setRigorLevel(isMath ? 0 : 100)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                isMath
                  ? 'border-violet-600 bg-violet-600 text-white hover:bg-violet-700'
                  : 'border-amber-600 bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              {isMath ? 'Ver Metáfora' : 'Ver Rigor'}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setTab((t) => (t === 'translator' ? 'evidence' : 'translator'))}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer ${
              tab === 'evidence'
                ? 'border-[#2E64B5] bg-[#2E64B5] text-white'
                : 'border-blue-200 bg-blue-50 text-[#2E64B5] hover:bg-blue-100'
            }`}
          >
            <BookImage className="h-3.5 w-3.5" />
            {tab === 'evidence' ? 'Traductor' : 'Bestiary'}
          </button>
        </div>
      </div>

      {tab === 'evidence' ? (
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-2.5">
          <div className="grid min-h-0 flex-1 grid-rows-2 gap-2.5">
            <div className="flex min-h-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#1B365D]">
                <span>Campelo &amp; Aranha (2021) — Catálogo de Metáforas Excesivas</span>
                <span className="font-mono text-[#2E64B5]">[R9]</span>
              </div>
              <div className="mt-1 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <img
                  src="/references/ec-bestiary.png"
                  alt="Evolutionary Computation Bestiary"
                  className="max-h-full w-auto object-contain"
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#1B365D]">
                <span>Cruz-Duarte et al. (2021) — Arquitectura Modular Sin Metáforas</span>
                <span className="font-mono text-[#2E64B5]">[R10]</span>
              </div>
              <div className="mt-1 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <img
                  src="/references/no-metaphors-modular.png"
                  alt="De metáforas animales a operadores modulares"
                  className="max-h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                        ? 'border-violet-500 bg-violet-50/80 ring-1 ring-violet-500/20 shadow-sm'
                        : 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                          isMath ? 'text-violet-700' : 'text-amber-700'
                        }`}
                      >
                        {isMath ? (
                          <FunctionSquare className="h-3.5 w-3.5" />
                        ) : (
                          <Dna className="h-3.5 w-3.5" />
                        )}
                        {isMath ? 'Operador' : 'Metáfora'}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">0{idx + 1}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isMath ? `math-${idx}` : `bio-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <h4 className="text-base font-bold text-black leading-snug">
                          {isMath ? card.mathTitle : card.bioTitle}
                        </h4>
                        <p className="mt-1 text-[13.5px] leading-snug text-[#1B365D]">
                          {isMath ? card.mathDesc : card.bioDesc}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs">
                    <MathFormula tex={card.tex} className="text-violet-900" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
