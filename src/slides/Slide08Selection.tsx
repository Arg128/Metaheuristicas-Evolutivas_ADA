import { useState } from 'react';
import { Disc, Swords } from 'lucide-react';
import { SelectionDemoSVG, type SelectionCandidate } from '../components/interactive/SelectionDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const CANDIDATES: SelectionCandidate[] = [
  { id: 'A', fitness: 48, color: '#7c3aed' },
  { id: 'B', fitness: 24, color: '#0891b2' },
  { id: 'C', fitness: 14, color: '#059669' },
  { id: 'D', fitness: 9, color: '#d97706' },
  { id: 'E', fitness: 5, color: '#e11d48' },
];

export function Slide08Selection({ meta, totalSlides }: SlideProps) {
  const [tournamentK, setTournamentK] = useState<number>(3);
  const [method, setMethod] = useState<'roulette' | 'tournament'>('tournament');

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La ruleta depende de la escala absoluta y puede ser dominada por súper-individuos; el torneo de tamaño k regula la presión selectiva de forma invariante al escalado."
    >
      {/* Left 6 Cols: Theory */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Ruleta Proporcional (FPS)"
          subtitle="Probabilidad linealmente proporcional a la aptitud"
          badge="Sensible a escala"
          icon={<Disc className="h-5 w-5" />}
          accent="amber"
          active={method === 'roulette'}
          onClick={() => setMethod('roulette')}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Asigna sectores proporcionales a <strong className="text-amber-800">fᵢ</strong>. Si un{' '}
            <strong className="text-rose-700">súper-individuo</strong> acapara el 80% de la aptitud total, monopoliza la reproducción y destruye la diversidad.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Selección por Torneo de Tamaño k"
          subtitle="Competición estocástica invariante a desplazamientos"
          badge={`k = ${tournamentK}`}
          icon={<Swords className="h-5 w-5" />}
          accent="violet"
          active={method === 'tournament'}
          onClick={() => setMethod('tournament')}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Extrae <MathFormula tex="k" /> individuos al azar y selecciona al mejor. Al aumentar{' '}
            <MathFormula tex="k" /> se incrementa la presión selectiva sin depender de la magnitud numérica de <MathFormula tex="f" />.
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

      {/* Right 6 Cols: Interactive SelectionDemoSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <SelectionDemoSVG
          candidates={CANDIDATES}
          tournamentK={tournamentK}
          onTournamentKChange={setTournamentK}
          activeMethod={method}
          onMethodChange={setMethod}
        />
      </div>
    </SlideLayout>
  );
}
