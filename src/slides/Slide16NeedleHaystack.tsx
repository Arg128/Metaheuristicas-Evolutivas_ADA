import { useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { NeedleHaystackSVG } from '../components/interactive/NeedleHaystackSVG';
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

export function Slide16NeedleHaystack({ meta, totalSlides }: SlideProps) {
  const [landscape, setLandscape] = useState<'gradient' | 'flat'>('flat');

  useSlideKeyboard({
    onNextState: () => setLandscape((m) => (m === 'flat' ? 'gradient' : 'flat')),
    onPrevState: () => setLandscape((m) => (m === 'flat' ? 'gradient' : 'flat')),
    onSelectNumber: (idx) => {
      if (idx === 0) setLandscape('flat');
      if (idx === 1) setLandscape('gradient');
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Sin correlación aptitud–distancia ni gradiente implícito, ningún optimizador supera al muestreo aleatorio (No Free Lunch)."
    >
      {/* Left 6 Cols: Theory + No Free Lunch PaperExcerpt */}
      <div className="col-span-6 flex flex-col gap-3.5">
        <InteractiveCard
          title="Paisajes Planos (Correcto / Incorrecto)"
          subtitle="Ausencia total de gradiente implícito"
          badge="Aguja en Pajar"
          icon={<HelpCircle className="h-5 w-5" />}
          accent="rose"
          active={landscape === 'flat'}
          onClick={() => setLandscape('flat')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Si toda solución errónea recibe igual puntaje <MathFormula tex="f(x)=c" /> (ej. clave criptográfica), la selección no distingue cercanía al óptimo.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Requisito: Correlación Espacial"
          subtitle="Cuándo funciona la búsqueda evolutiva"
          badge="Con Gradiente"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="emerald"
          active={landscape === 'gradient'}
          onClick={() => setLandscape('gradient')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Las metaheurísticas explotan estructura local: vecinos de buenas soluciones deben promediar mejor aptitud.
          </p>
        </InteractiveCard>

        <PaperExcerpt
          category="Theorem 1 — No Free Lunch (Wolpert & Macready, 1997)"
          sourceTag="[R14] IEEE TEVC"
          accentColor="crimson"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(NFL)"
        >
          <PaperTermHighlight accentColor="crimson">No Free Lunch!</PaperTermHighlight>{' '}
          Promediando sobre todas las funciones posibles, ningún algoritmo supera a la búsqueda aleatoria ciega sin aprovechar la estructura del dominio.
        </PaperExcerpt>
      </div>

      {/* Right 6 Cols: Interactive NeedleHaystackSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <NeedleHaystackSVG landscape={landscape} onLandscapeChange={setLandscape} />
      </div>
    </SlideLayout>
  );
}
