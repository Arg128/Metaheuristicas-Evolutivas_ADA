import { useState } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { HammingGrayDemoSVG } from '../components/interactive/HammingGrayDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';
import { hammingDistance } from '../utils/prng';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide17HammingGray({ meta, totalSlides }: SlideProps) {
  const [value, setValue] = useState<number>(7);
  const currVal = Math.max(0, Math.min(14, value));
  const distBin = hammingDistance(currVal, currVal + 1);

  useSlideKeyboard({
    onNextState: () => setValue((v) => Math.min(14, v + 1)),
    onPrevState: () => setValue((v) => Math.max(0, v - 1)),
    onAction: () => setValue(7),
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El Código Gray G = B ⊕ (B >> 1) elimina paredes de Hamming garantizando que enteros adyacentes difieran en un solo bit (d_H = 1)."
    >
      {/* Left 6 Cols: Theory + Whitley PaperExcerpt */}
      <div className="col-span-6 flex flex-col gap-3.5">
        <InteractiveCard
          title="Paredes de Hamming en Binario"
          subtitle="Barrera destructiva entre enteros contiguos"
          badge="d_H(7, 8) = 4"
          icon={<ShieldAlert className="h-5 w-5" />}
          accent="rose"
          active={distBin >= 3}
          onClick={() => setValue(7)}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Pasar de <strong className="text-black">7</strong> (<code className="rounded bg-rose-50 px-1 font-mono font-bold text-rose-700">0111</code>) a{' '}
            <strong className="text-black">8</strong> (<code className="rounded bg-rose-50 px-1 font-mono font-bold text-rose-700">1000</code>) exige mutar{' '}
            <strong className="text-rose-700">4 bits a la vez</strong> (<MathFormula tex="p_m^4" />).
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Solución: Código Reflejado de Gray"
          subtitle="Adyacencia unitaria preservada en el genotipo"
          badge="d_H = 1 siempre"
          icon={<Sparkles className="h-5 w-5" />}
          accent="emerald"
          active
          className="flex flex-1 flex-col justify-center"
        >
          <p className="text-[15.5px] leading-snug text-[#1B365D]">
            Todo paso <MathFormula tex="n \rightarrow n+1" /> cambia un <strong className="text-emerald-700">solo bit</strong>: de 7 (
            <code className="rounded bg-emerald-50 px-1 font-mono font-bold text-emerald-800">0100</code>) a 8 (
            <code className="rounded bg-emerald-50 px-1 font-mono font-bold text-emerald-800">1100</code>).
          </p>
        </InteractiveCard>

        <PaperExcerpt
          category="Codificación Gray vs. Binaria (Whitley, 1999)"
          sourceTag="[R15] GECCO '99"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(4)"
        >
          La representación Gray preserva{' '}
          <PaperTermHighlight>adyacencia unitaria d_H = 1</PaperTermHighlight>{' '}
          y reduce los óptimos locales artificiales creados por discontinuidades de representación binaria.
        </PaperExcerpt>
      </div>

      {/* Right 6 Cols: Interactive HammingGrayDemoSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <HammingGrayDemoSVG value={currVal} onChange={setValue} />
      </div>
    </SlideLayout>
  );
}
