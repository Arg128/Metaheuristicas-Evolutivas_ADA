import { useState } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { HammingGrayDemoSVG } from '../components/interactive/HammingGrayDemoSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
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

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El Código Gray G = B ^ (B >> 1) elimina las paredes de Hamming asegurando que enteros adyacentes difieran exactamente en un único bit (d_H = 1)."
    >
      {/* Left 6 Cols: Theory */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <InteractiveCard
          title="Paredes de Hamming en Binario Estándar"
          subtitle="Barrera destructiva en transiciones adyacentes"
          badge="d_H(7, 8) = 4"
          icon={<ShieldAlert className="h-5 w-5" />}
          accent="rose"
          active={distBin >= 3}
          onClick={() => setValue(7)}
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Aunque <strong className="text-slate-900">7</strong> y <strong className="text-slate-900">8</strong> son vecinos en el fenotipo, sus genotipos{' '}
            <code className="rounded bg-rose-50 px-1 font-mono font-semibold text-rose-700">0111</code> y <code className="rounded bg-rose-50 px-1 font-mono font-semibold text-rose-700">1000</code> exigen invertir{' '}
            <strong className="text-rose-700">4 bits simultáneamente</strong> (probabilidad <MathFormula tex="p_m^4" />).
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Solución: Codificación Reflejada de Gray"
          subtitle="Adyacencia unitaria preservada en el genotipo"
          badge="d_H = 1 siempre"
          icon={<Sparkles className="h-5 w-5" />}
          accent="emerald"
          active
        >
          <p className="text-xs text-slate-700 leading-relaxed">
            Con <MathFormula tex="G = B \oplus (B \gg 1)" />, todo paso <MathFormula tex="n \rightarrow n+1" /> requiere invertir un{' '}
            <strong className="text-emerald-700">solo bit</strong>. Un bit-flip simple cruza de 7 (<code className="rounded bg-emerald-50 px-1 font-mono font-semibold text-emerald-800">0100</code>) a 8 (<code className="rounded bg-emerald-50 px-1 font-mono font-semibold text-emerald-800">1100</code>).
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

      {/* Right 6 Cols: Interactive HammingGrayDemoSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <HammingGrayDemoSVG value={currVal} onChange={setValue} />
      </div>
    </SlideLayout>
  );
}
