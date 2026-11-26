import { useState } from 'react';
import { Scissors, Shuffle } from 'lucide-react';
import { CrossoverDemoSVG, type CrossoverMode } from '../components/interactive/CrossoverDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const CROSSOVER_MODES: CrossoverMode[] = ['1-point', '2-point', 'uniform'];

export function Slide09Crossover({ meta, totalSlides }: SlideProps) {
  const [mode, setMode] = useState<CrossoverMode>('1-point');

  useSlideKeyboard({
    onNextState: () =>
      setMode((prev) => CROSSOVER_MODES[(CROSSOVER_MODES.indexOf(prev) + 1) % CROSSOVER_MODES.length]),
    onPrevState: () =>
      setMode(
        (prev) =>
          CROSSOVER_MODES[
            (CROSSOVER_MODES.indexOf(prev) - 1 + CROSSOVER_MODES.length) % CROSSOVER_MODES.length
          ],
      ),
    onSelectNumber: (idx) => {
      if (idx < CROSSOVER_MODES.length) setMode(CROSSOVER_MODES[idx]);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La recombinación ensambla bloques de construcción cortos y de alta aptitud, acotados por el Teorema del Esquema de Holland."
    >
      {/* Left 6 Cols: Crossover Variants + Schema Theorem PaperExcerpt */}
      <div className="col-span-6 flex flex-col gap-3.5">
        <div className="grid grid-cols-3 gap-2.5">
          <InteractiveCard
            title="1 Punto"
            subtitle="Corte simple"
            icon={<Scissors className="h-4 w-4" />}
            accent="violet"
            active={mode === '1-point'}
            onClick={() => setMode('1-point')}
            className="!p-3.5"
          >
            <p className="text-[13.5px] leading-snug text-[#1B365D]">
              Preserva esquemas de baja longitud δ(H).
            </p>
          </InteractiveCard>

          <InteractiveCard
            title="2 Puntos"
            subtitle="Segmento central"
            icon={<Scissors className="h-4 w-4" />}
            accent="cyan"
            active={mode === '2-point'}
            onClick={() => setMode('2-point')}
            className="!p-3.5"
          >
            <p className="text-[13.5px] leading-snug text-[#1B365D]">
              Reduce sesgo posicional en extremos.
            </p>
          </InteractiveCard>

          <InteractiveCard
            title="Uniforme"
            subtitle="Máscara p = 0.5"
            icon={<Shuffle className="h-4 w-4" />}
            accent="emerald"
            active={mode === 'uniform'}
            onClick={() => setMode('uniform')}
            className="!p-3.5"
          >
            <p className="text-[13.5px] leading-snug text-[#1B365D]">
              Máxima mezcla exploratoria gen a gen.
            </p>
          </InteractiveCard>
        </div>

        <PaperExcerpt
          category="Teorema del Esquema y Bloques de Construcción (Holland, 1975; Goldberg, 1989)"
          sourceTag="[R5] MIT · [R6] Addison-Wesley"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(1)"
        >
          Los{' '}
          <PaperTermHighlight>bloques cortos δ(H) y bajo orden o(H)</PaperTermHighlight>{' '}
          con aptitud superior a la media crecen exponencialmente entre generaciones bajo selección y cruce.
        </PaperExcerpt>

        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2E64B5]">
            <span>Formalización Vectorial (Cruz-Duarte et al., 2021)</span>
            <span className="font-mono">[R10] SWEVO</span>
          </div>
          <p className="mt-1.5 text-[15px] font-medium leading-snug text-[#1B365D]">
            Cada descendiente combina padres distintos mediante una máscara binaria o real{' '}
            <strong className="text-black">y = m ⊙ x₁ + (1 − m) ⊙ x₂</strong>. Puedes ver el recorte original en el panel derecho.
          </p>
        </div>
      </div>

      {/* Right 6 Cols: Interactive CrossoverDemoSVG + SWEVO Def 15 Toggle */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <CrossoverDemoSVG mode={mode} onModeChange={setMode} />
      </div>
    </SlideLayout>
  );
}
