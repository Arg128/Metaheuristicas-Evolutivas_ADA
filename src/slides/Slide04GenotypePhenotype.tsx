import { Binary, Calculator, Cpu } from 'lucide-react';
import { GenotypePhenotypeLab } from '../components/interactive/GenotypePhenotypeLab';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide04GenotypePhenotype({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El algoritmo evolutivo opera exclusivamente sobre el genotipo G; el mapeo φ lo traduce al fenotipo F para que f mida su aptitud real."
    >
      {/* Left 6 Cols: Formal Definitions + MathFormula */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Genotipo (G) — Espacio de Búsqueda"
          subtitle="Codificación matemática manipulable por los operadores"
          badge="Representación"
          icon={<Binary className="h-5 w-5" />}
          accent="cyan"
          active
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Estructura interna (bits, vectores reales, permutaciones o árboles) sobre la que actúan el cruce y la mutación sin conocer la física del problema.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Fenotipo (F) — Espacio de Soluciones"
          subtitle="Mapeo de decodificación φ: G → F"
          badge="Decodificación"
          icon={<Cpu className="h-5 w-5" />}
          accent="violet"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Instancia física o matemática válida del problema (geometría de una antena, perfil aerodinámico o modelo simbólico) obtenida mediante{' '}
            <MathFormula tex="\phi(\mathbf{g}) = \mathbf{x} \in \mathcal{F}" />.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Función de Aptitud (Fitness) f: G → ℝ"
          subtitle="Señal escalar de calidad para orientar la selección"
          badge="Evaluación"
          icon={<Calculator className="h-5 w-5" />}
          accent="emerald"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Asigna a cada individuo un valor numérico comparable que resume desempeño, restricciones y penalizaciones.
          </p>
        </InteractiveCard>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="cyan"
          />
        ) : null}
      </div>

      {/* Right 6 Cols: Interactive GenotypePhenotypeLab */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <GenotypePhenotypeLab />
      </div>
    </SlideLayout>
  );
}
