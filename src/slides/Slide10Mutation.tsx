import { useState } from 'react';
import { Activity, Sliders } from 'lucide-react';
import { MutationAgaSVG } from '../components/interactive/MutationAgaSVG';
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

export function Slide10Mutation({ meta, totalSlides }: SlideProps) {
  const [sigma, setSigma] = useState<number>(0.45);
  const [agaEnabled, setAgaEnabled] = useState<boolean>(true);

  useSlideKeyboard({
    onNextState: () => setAgaEnabled((v) => !v),
    onPrevState: () => setAgaEnabled((v) => !v),
    onToggleView: () => setAgaEnabled((v) => !v),
    onSelectNumber: (idx) => {
      if (idx === 0) setAgaEnabled(true);
      if (idx === 1) setAgaEnabled(false);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La mutación asegura ergodicidad (ningún estado es inalcanzable); los AGAs ajustan p_c y p_m según la varianza poblacional."
    >
      {/* Left 6 Cols: Bit-flip, Gaussian, PaperExcerpt + AGA Toggle */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <div className="grid grid-cols-2 gap-3">
          <InteractiveCard
            title="Bit-Flip Discreto"
            subtitle="Tasa por gen p_m"
            icon={<Sliders className="h-5 w-5" />}
            accent="violet"
          >
            <p className="text-[14.5px] leading-snug text-[#1B365D]">
              Invierte cada bit con <MathFormula tex="p_m \approx 1/L" />, reintroduciendo alelos perdidos.
            </p>
          </InteractiveCard>

          <InteractiveCard
            title="Perturbación Gaussiana"
            subtitle="Espacios continuos ℝᴰ"
            icon={<Activity className="h-5 w-5" />}
            accent="cyan"
          >
            <p className="text-[14.5px] leading-snug text-[#1B365D]">
              Suma ruido <MathFormula tex="\mathcal{N}(0, \sigma^2 \mathbf{I})" />: pasos cortos frecuentes y saltos amplios.
            </p>
          </InteractiveCard>
        </div>

        <InteractiveCard
          title="Algoritmos Genéticos Adaptativos (AGAs)"
          subtitle="Control dinámico de p_c y p_m en tiempo real"
          badge={agaEnabled ? 'AGA Activo' : 'Estático'}
          accent="amber"
          active={agaEnabled}
          onClick={() => setAgaEnabled((v) => !v)}
        >
          <p className="text-[15px] leading-snug text-[#1B365D]">
            Si cae la varianza de aptitud, AGA eleva <MathFormula tex="p_m" /> y baja <MathFormula tex="p_c" /> para escapar de óptimos locales; si hay diversidad, explota.
          </p>
        </InteractiveCard>

        <PaperExcerpt
          category="Ergodicidad y Tasas Adaptativas (Rudolph, 1994; Srinivas & Patnaik, 1994)"
          sourceTag="[R12] IEEE TSMC · [R13] IEEE TNN"
          formulaTex={meta.keyFormula?.tex}
          equationNumber="(2)"
        >
          Con <PaperTermHighlight>P(x → y) &gt; 0</PaperTermHighlight> la cadena de Markov es ergódica; ajustar{' '}
          <PaperTermHighlight>p_c y p_m con Var(f)</PaperTermHighlight> evita estancamientos prematuros.
        </PaperExcerpt>
      </div>

      {/* Right 6 Cols: Interactive MutationAgaSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <MutationAgaSVG
          sigma={sigma}
          onSigmaChange={setSigma}
          agaEnabled={agaEnabled}
          onToggleAga={() => setAgaEnabled((v) => !v)}
        />
      </div>
    </SlideLayout>
  );
}
