import { useState } from 'react';
import { Blocks, Scissors, Shuffle } from 'lucide-react';
import { CrossoverDemoSVG, type CrossoverMode } from '../components/interactive/CrossoverDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide09Crossover({ meta, totalSlides }: SlideProps) {
  const [mode, setMode] = useState<CrossoverMode>('1-point');

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La recombinación ensambla bloques de construcción cortos, de bajo orden y alta aptitud procedentes de padres distintos, tal como acota el Teorema del Esquema de Holland."
    >
      {/* Left 6 Cols: Operators + Holland + Goldberg */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
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
            <p className="text-[11px] text-slate-300">Preserva esquemas de baja longitud definitoria δ(H).</p>
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
            <p className="text-[11px] text-slate-300">Reduce sesgo posicional en extremos del cromosoma.</p>
          </InteractiveCard>

          <InteractiveCard
            title="Uniforme"
            subtitle="Máscara aleatoria"
            icon={<Shuffle className="h-4 w-4" />}
            accent="emerald"
            active={mode === 'uniform'}
            onClick={() => setMode('uniform')}
            className="!p-3.5"
          >
            <p className="text-[11px] text-slate-300">Máxima mezcla exploratoria bit a bit (p = 0.5).</p>
          </InteractiveCard>
        </div>

        <InteractiveCard
          title="Hipótesis del Bloque de Construcción (Goldberg)"
          subtitle="Teorema del Esquema de Holland"
          badge="Fundamento"
          icon={<Blocks className="h-5 w-5" />}
          accent="violet"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Un esquema <MathFormula tex="H" /> corto (baja longitud definitoria{' '}
            <MathFormula tex="\delta(H)" />), de bajo orden <MathFormula tex="o(H)" /> y aptitud superior a la media{' '}
            <MathFormula tex="\bar{f}(H) > \bar{f}" /> crece exponencialmente en generaciones sucesivas.
          </p>
        </InteractiveCard>

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

      {/* Right 6 Cols: Interactive CrossoverDemoSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <CrossoverDemoSVG mode={mode} onModeChange={setMode} />
      </div>
    </SlideLayout>
  );
}
