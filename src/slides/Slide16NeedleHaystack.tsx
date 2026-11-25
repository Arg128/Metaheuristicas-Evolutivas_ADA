import { useState } from 'react';
import { AlertTriangle, Compass, HelpCircle } from 'lucide-react';
import { NeedleHaystackSVG } from '../components/interactive/NeedleHaystackSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide16NeedleHaystack({ meta, totalSlides }: SlideProps) {
  const [landscape, setLandscape] = useState<'gradient' | 'flat'>('flat');

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Sin correlación espacial ni gradiente implícito de mejora, las metaheurísticas evolutivas pierden su ventaja y colapsan en muestreo aleatorio uniforme."
    >
      {/* Left 6 Cols: Theory */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Explosión Combinatoria sin Estructura"
          subtitle="Cuando el espacio carece de pistas parciales"
          badge="Límite Teórico"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="amber"
          active={landscape === 'flat'}
          onClick={() => setLandscape('flat')}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Una metaheurística necesita que soluciones cercanas al óptimo tengan mejor aptitud promedio que soluciones lejanas (correlación aptitud-distancia).
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Paisajes Planos de Decisión (Correcto / Incorrecto)"
          subtitle="Ausencia total de gradiente implícito"
          badge="Aguja en Pajar"
          icon={<HelpCircle className="h-5 w-5" />}
          accent="rose"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Si toda respuesta incorrecta recibe exactamente el mismo puntaje <MathFormula tex="f(x) = c" /> (ej. romper una clave criptográfica exacta), ningún operador puede distinguir qué padre está más cerca.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Colapso a Búsqueda Aleatoria Uniforme"
          subtitle="Degradación de la presión selectiva"
          icon={<Compass className="h-5 w-5" />}
          accent="cyan"
          active={landscape === 'gradient'}
          onClick={() => setLandscape('gradient')}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Al igualarse todas las aptitudes en la meseta, <MathFormula tex="P(i) = 1/N" />: la selección deja de orientar la búsqueda.
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

      {/* Right 6 Cols: Interactive NeedleHaystackSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <NeedleHaystackSVG landscape={landscape} onLandscapeChange={setLandscape} />
      </div>
    </SlideLayout>
  );
}
