import { useState } from 'react';
import { GitBranch, Network, Route } from 'lucide-react';
import { TaxonomyTreeSVG, type TaxonomyBranch } from '../components/interactive/TaxonomyTreeSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const BRANCH_ORDER: TaxonomyBranch[] = ['trajectory', 'swarm', 'evolutionary'];

export function Slide03Taxonomy({ meta, totalSlides }: SlideProps) {
  const [activeBranch, setActiveBranch] = useState<TaxonomyBranch>('evolutionary');

  useSlideKeyboard({
    onNextState: () =>
      setActiveBranch((prev) => BRANCH_ORDER[(BRANCH_ORDER.indexOf(prev) + 1) % BRANCH_ORDER.length]),
    onPrevState: () =>
      setActiveBranch(
        (prev) =>
          BRANCH_ORDER[(BRANCH_ORDER.indexOf(prev) - 1 + BRANCH_ORDER.length) % BRANCH_ORDER.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < BRANCH_ORDER.length) setActiveBranch(BRANCH_ORDER[idx]);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Las metaheurísticas poblacionales superan la búsqueda punto a punto; la Computación Evolutiva agrupa AG, EE, PE, PG y DE."
    >
      {/* Left 5 Cols: Conceptual Contrast */}
      <div className="col-span-5 flex flex-col gap-3.5">
        <InteractiveCard
          title="Trayectoria Única"
          subtitle="Búsqueda secuencial punto a punto"
          badge="SA · Tabu"
          icon={<Route className="h-5 w-5" />}
          accent="amber"
          active={activeBranch === 'trajectory'}
          onClick={() => setActiveBranch('trajectory')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Perturba una sola solución por paso (<strong className="text-amber-800">Simulated Annealing</strong>,{' '}
            <strong className="text-amber-800">Tabu Search</strong>). Poca memoria, mayor riesgo de estancamiento.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Poblacionales: Enjambre"
          subtitle="Interacción colectiva sin cruce"
          badge="ACO · PSO"
          icon={<Network className="h-5 w-5" />}
          accent="emerald"
          active={activeBranch === 'swarm'}
          onClick={() => setActiveBranch('swarm')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Múltiples agentes coordinados por feromonas o velocidades (<strong className="text-emerald-800">ACO</strong>,{' '}
            <strong className="text-emerald-800">PSO</strong>).
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Computación Evolutiva"
          subtitle="Las 5 familias canónicas"
          badge="AG · EE · PE · PG · DE"
          icon={<GitBranch className="h-5 w-5" />}
          accent="cyan"
          active={activeBranch === 'evolutionary'}
          onClick={() => setActiveBranch('evolutionary')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Incluye <strong className="text-cyan-800">AG</strong>, <strong className="text-cyan-800">EE</strong>,{' '}
            <strong className="text-cyan-800">PE</strong>, <strong className="text-cyan-800">PG</strong> y{' '}
            <strong className="text-cyan-800">Evolución Diferencial (DE)</strong> bajo selección estocástica.
          </p>
        </InteractiveCard>
      </div>

      {/* Right 7 Cols: Interactive TaxonomyTreeSVG + NEOS Reference View */}
      <div className="col-span-7 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <TaxonomyTreeSVG activeBranch={activeBranch} onSelectBranch={setActiveBranch} />
      </div>
    </SlideLayout>
  );
}
