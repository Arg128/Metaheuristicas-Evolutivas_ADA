import { useState } from 'react';
import { Disc, Swords } from 'lucide-react';
import { SelectionDemoSVG, type SelectionCandidate } from '../components/interactive/SelectionDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
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

  useSlideKeyboard({
    onNextState: () => setMethod((m) => (m === 'roulette' ? 'tournament' : 'roulette')),
    onPrevState: () => setMethod((m) => (m === 'roulette' ? 'tournament' : 'roulette')),
    onSelectNumber: (idx) => {
      if (idx === 0) setMethod('roulette');
      if (idx === 1) setMethod('tournament');
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La ruleta sufre ante súper-individuos; el torneo de tamaño k regula la presión selectiva sin depender de la escala de f."
    >
      {/* Left 6 Cols: Theory + PaperExcerpt */}
      <div className="col-span-6 flex flex-col gap-3.5">
        <InteractiveCard
          title="Ruleta Proporcional (FPS)"
          subtitle="Probabilidad proporcional a la aptitud"
          badge="Sensible a escala"
          icon={<Disc className="h-5 w-5" />}
          accent="amber"
          active={method === 'roulette'}
          onClick={() => setMethod('roulette')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Asigna sectores proporcionales a <strong className="text-amber-800">fᵢ</strong>. Un{' '}
            <strong className="text-rose-700">súper-individuo</strong> monopoliza los cruces y colapsa la diversidad.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Selección por Torneo (k)"
          subtitle="Competición aleatoria invariante a traslaciones"
          badge={`k = ${tournamentK}`}
          icon={<Swords className="h-5 w-5" />}
          accent="violet"
          active={method === 'tournament'}
          onClick={() => setMethod('tournament')}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Elige al mejor entre <strong className="text-violet-800">{tournamentK} candidatos aleatorios</strong>; aumentar{' '}
            <strong className="text-violet-800">k</strong> eleva la presión selectiva de forma directa.
          </p>
        </InteractiveCard>

        <PaperExcerpt
          category="Análisis de Selección (Blickle & Thiele, 1996)"
          sourceTag="[R11] Evol. Comput. 4(4)"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(FPS)"
        >
          La selección por torneo ofrece{' '}
          <PaperTermHighlight>presión selectiva modulable por k</PaperTermHighlight>{' '}
          con complejidad O(N) e invariancia al escalado de la función objetivo.
        </PaperExcerpt>
      </div>

      {/* Right 6 Cols: Interactive SelectionDemoSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
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
