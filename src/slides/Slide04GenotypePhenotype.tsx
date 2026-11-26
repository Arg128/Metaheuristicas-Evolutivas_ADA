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
      keyTakeaway="El algoritmo manipula exclusivamente el genotipo G; el mapeo φ lo traduce al fenotipo F para que f mida su aptitud."
    >
      {/* Left 6 Cols: Formal Definitions + MathFormula */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Genotipo (G) — Espacio de Búsqueda"
          subtitle="Codificación matemática manipulable"
          badge="Representación"
          icon={<Binary className="h-5 w-5" />}
          accent="cyan"
          active
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Bits, vectores reales o árboles sobre los que operan cruce y mutación sin conocer la física del problema.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Fenotipo (F) — Solución Real"
          subtitle="Mapeo de decodificación φ: G → F"
          badge="Decodificación"
          icon={<Cpu className="h-5 w-5" />}
          accent="violet"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Instancia física o modelo válido (perfil alar, antena o circuito) obtenido vía{' '}
            <MathFormula tex="\phi(\mathbf{g}) = \mathbf{x} \in \mathcal{F}" />.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Función de Aptitud f: G → ℝ"
          subtitle="Señal escalar para guiar la selección"
          badge="Evaluación"
          icon={<Calculator className="h-5 w-5" />}
          accent="emerald"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Resume desempeño, restricciones y penalizaciones en un valor numérico comparable.
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
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <GenotypePhenotypeLab />
      </div>
    </SlideLayout>
  );
}
