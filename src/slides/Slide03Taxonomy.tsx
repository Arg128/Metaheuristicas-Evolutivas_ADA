import { useState } from 'react';
import { GitBranch, Network, Route } from 'lucide-react';
import { TaxonomyTreeSVG, type TaxonomyBranch } from '../components/interactive/TaxonomyTreeSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide03Taxonomy({ meta, totalSlides }: SlideProps) {
  const [activeBranch, setActiveBranch] = useState<TaxonomyBranch>('evolutionary');

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Las metaheurísticas poblacionales superan la búsqueda punto a punto al paralelizar la exploración; dentro de ellas, la Computación Evolutiva abarca AG, EE, PE, PG y Evolución Diferencial (DE)."
    >
      {/* Left 5 Cols: Conceptual Contrast */}
      <div className="col-span-5 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Trayectoria Única"
          subtitle="Búsqueda secuencial punto a punto"
          badge="SA · Tabu"
          icon={<Route className="h-5 w-5" />}
          accent="amber"
          active={activeBranch === 'trajectory'}
          onClick={() => setActiveBranch('trajectory')}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Recorre un camino único en el paisaje de búsqueda (<strong className="text-amber-800">Simulated Annealing</strong>,{' '}
            <strong className="text-amber-800">Tabu Search</strong>). Bajo costo en memoria, mayor riesgo de quedar en cuencas aisladas.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Poblacionales: Enjambre"
          subtitle="Interacción colectiva sin cruce genético"
          badge="ACO · PSO"
          icon={<Network className="h-5 w-5" />}
          accent="emerald"
          active={activeBranch === 'swarm'}
          onClick={() => setActiveBranch('swarm')}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Múltiples agentes comparten mejores posiciones locales y globales (<strong className="text-emerald-800">ACO</strong>,{' '}
            <strong className="text-emerald-800">PSO</strong>).
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Poblacionales: Computación Evolutiva"
          subtitle="Las 5 familias canónicas"
          badge="AG · EE · PE · PG · DE"
          icon={<GitBranch className="h-5 w-5" />}
          accent="cyan"
          active={activeBranch === 'evolutionary'}
          onClick={() => setActiveBranch('evolutionary')}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Integra <strong className="text-cyan-800">AG</strong>, <strong className="text-cyan-800">EE</strong>,{' '}
            <strong className="text-cyan-800">PE</strong>, <strong className="text-cyan-800">PG</strong> y{' '}
            <strong className="text-cyan-800">Evolución Diferencial (DE)</strong> bajo selección y variación estocástica.
          </p>
        </InteractiveCard>
      </div>

      {/* Right 7 Cols: Interactive TaxonomyTreeSVG */}
      <div className="col-span-7 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <TaxonomyTreeSVG activeBranch={activeBranch} onSelectBranch={setActiveBranch} />
      </div>
    </SlideLayout>
  );
}
