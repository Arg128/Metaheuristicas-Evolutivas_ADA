import { useState } from 'react';
import { Clock, ShieldCheck, TimerOff, TrendingDown } from 'lucide-react';
import { ElitismChartSVG } from '../components/interactive/ElitismChartSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide11ElitismStopping({ meta, totalSlides }: SlideProps) {
  const [elitismOn, setElitismOn] = useState<boolean>(true);

  useSlideKeyboard({
    onNextState: () => setElitismOn((v) => !v),
    onPrevState: () => setElitismOn((v) => !v),
    onToggleView: () => setElitismOn((v) => !v),
    onSelectNumber: (idx) => {
      if (idx === 0) setElitismOn(true);
      if (idx === 1) setElitismOn(false);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El elitismo asegura una trayectoria monótona no degradante de la mejor aptitud; los criterios de parada acotan el presupuesto."
    >
      {/* Left 6 Cols: Elitism + 3 Stopping Criteria + Rudolph Theorem PaperExcerpt */}
      <div className="col-span-6 flex flex-col justify-between gap-2.5">
        <InteractiveCard
          title="Elitismo (Conservación Top-E)"
          subtitle="Trinquete contra pérdida estocástica"
          badge={elitismOn ? 'ON' : 'OFF'}
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="emerald"
          active={elitismOn}
          onClick={() => setElitismOn((v) => !v)}
        >
          <p className="text-[15px] leading-snug text-[#1B365D]">
            Copia intactos los <MathFormula tex="E" /> mejores individuos de <MathFormula tex="P^{(g)}" /> a{' '}
            <MathFormula tex="P^{(g+1)}" /> para proteger el óptimo hallado.
          </p>
        </InteractiveCard>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <h3 className="mb-2 text-base font-bold text-black">
            Tres Criterios Canónicos de Parada
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <TimerOff className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
              <div className="text-[14.5px] leading-snug text-[#1B365D]">
                <strong className="text-black">1. Límite g_max:</strong>{' '}
                detiene tras un número fijo de generaciones.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
              <div className="text-[14.5px] leading-snug text-[#1B365D]">
                <strong className="text-black">2. Meseta (Δf &lt; ε):</strong>{' '}
                finaliza si no hay mejora en W generaciones.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div className="text-[14.5px] leading-snug text-[#1B365D]">
                <strong className="text-black">3. Presupuesto t_max:</strong>{' '}
                clave en tiempo real o simulaciones CFD/FEA.
              </div>
            </div>
          </div>
        </div>

        <PaperExcerpt
          category="Teorema de Convergencia Global (Rudolph, 1994)"
          sourceTag="[R13] IEEE Trans. Neural Netw."
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(3)"
        >
          Un AG canónico sin elitismo no converge al óptimo global; la{' '}
          <PaperTermHighlight>preservación elitista monótona</PaperTermHighlight>{' '}
          garantiza P(x_best → x*) = 1 cuando g → ∞.
        </PaperExcerpt>
      </div>

      {/* Right 6 Cols: Interactive ElitismChartSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <ElitismChartSVG
          elitismOn={elitismOn}
          onToggleElitism={() => setElitismOn((v) => !v)}
        />
      </div>
    </SlideLayout>
  );
}
