import { Cpu, HardDrive, Layers } from 'lucide-react';
import { ComplexityDonutSVG } from '../components/interactive/ComplexityDonutSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide15Complexity({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Aunque memoria y operadores genéticos escalan linealmente en O(N·L), en ingeniería real la evaluación C_fit (CFD/FEA) supera el 90% del tiempo total."
    >
      {/* Left 6 Cols: Space & Time Complexity */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Complejidad Espacial: O(N · L)"
          subtitle="Almacenamiento de población y búfer descendiente"
          badge="Memoria Lineal"
          icon={<HardDrive className="h-5 w-5" />}
          accent="cyan"
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Solo mantiene <MathFormula tex="N" /> cromosomas de longitud <MathFormula tex="L" /> y su vector de aptitud: muy liviano frente a árboles de búsqueda exponenciales.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Complejidad Temporal por Generación"
          subtitle="Operadores genéticos vs. Función de evaluación"
          badge="O(N · C_fit + N · L)"
          icon={<Cpu className="h-5 w-5" />}
          accent="amber"
          active
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Torneo, cruce y mutación cuestan <MathFormula tex="\mathcal{O}(N \cdot L)" />. Sin embargo, el término dominante es{' '}
            <strong className="text-amber-800">C_fit &gt; 90%</strong> cuando cada individuo dispara una simulación numérica <strong className="text-amber-800">CFD o FEA</strong>.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Implicación Arquitectónica"
          subtitle="Paralelismo a nivel de población"
          icon={<Layers className="h-5 w-5" />}
          accent="emerald"
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Como las <MathFormula tex="N" /> evaluaciones de aptitud son independientes dentro de cada generación, el algoritmo se paraleliza trivialmente en clústeres o GPUs.
          </p>
        </InteractiveCard>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="amber"
          />
        ) : null}
      </div>

      {/* Right 6 Cols: Interactive ComplexityDonutSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <ComplexityDonutSVG />
      </div>
    </SlideLayout>
  );
}
