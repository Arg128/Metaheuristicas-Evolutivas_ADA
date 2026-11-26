import { useState } from 'react';
import { Clock, ShieldCheck, TimerOff, TrendingDown } from 'lucide-react';
import { ElitismChartSVG } from '../components/interactive/ElitismChartSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide11ElitismStopping({ meta, totalSlides }: SlideProps) {
  const [elitismOn, setElitismOn] = useState<boolean>(true);

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El elitismo garantiza una trayectoria monótona no degradante de la mejor solución, mientras los criterios de parada acotan el presupuesto computacional."
    >
      {/* Left 6 Cols: Elitism + 3 Stopping Criteria */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Elitismo (Conservación Top-E)"
          subtitle="Trinquete de seguridad contra degradación estocástica"
          badge={elitismOn ? 'ON' : 'OFF'}
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="emerald"
          active={elitismOn}
          onClick={() => setElitismOn((v) => !v)}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Copia intactos los <MathFormula tex="E" /> mejores individuos de <MathFormula tex="P^{(g)}" /> a{' '}
            <MathFormula tex="P^{(g+1)}" />. Evita que el cruce o la mutación destruyan el mejor óptimo encontrado.
          </p>
        </InteractiveCard>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <h3 className="mb-2.5 text-sm font-bold text-slate-900">
            Tres Criterios Canónicos de Parada
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <TimerOff className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">1. Límite generacional (g_max):</strong>{' '}
                detiene la ejecución tras un número fijo de generaciones o evaluaciones.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">2. Meseta de aptitud (Δf &lt; ε):</strong>{' '}
                finaliza cuando la mejora acumulada en W generaciones es despreciable.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">3. Presupuesto temporal (t_max):</strong>{' '}
                imprescindible en sistemas en tiempo real o simulaciones CFD/FEA costosas.
              </div>
            </div>
          </div>
        </div>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="emerald"
          />
        ) : null}
      </div>

      {/* Right 6 Cols: Interactive ElitismChartSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <ElitismChartSVG
          elitismOn={elitismOn}
          onToggleElitism={() => setElitismOn((v) => !v)}
        />
      </div>
    </SlideLayout>
  );
}
