import { useState } from 'react';
import { Activity, Infinity as InfinityIcon, Sliders } from 'lucide-react';
import { MutationAgaSVG } from '../components/interactive/MutationAgaSVG';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide10Mutation({ meta, totalSlides }: SlideProps) {
  const [sigma, setSigma] = useState<number>(0.45);
  const [agaEnabled, setAgaEnabled] = useState<boolean>(true);

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="La mutación asegura la ergodicidad de la cadena de Markov evolutiva; los AGAs adaptan dinámicamente p_c y p_m según la varianza de aptitud."
    >
      {/* Left 6 Cols: Bit-flip, Gaussian, Ergodicity, AGAs */}
      <div className="col-span-6 flex flex-col justify-between gap-3">
        <div className="grid grid-cols-2 gap-3">
          <InteractiveCard
            title="Bit-Flip Discreto"
            subtitle="Tasa por gen p_m"
            icon={<Sliders className="h-5 w-5" />}
            accent="violet"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              Invierte cada bit <MathFormula tex="0 \leftrightarrow 1" /> con probabilidad típica{' '}
              <MathFormula tex="p_m \approx 1/L" />, reintroduciendo alelos perdidos.
            </p>
          </InteractiveCard>

          <InteractiveCard
            title="Perturbación Gaussiana"
            subtitle="Espacios continuos ℝᴰ"
            icon={<Activity className="h-5 w-5" />}
            accent="cyan"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              Suma ruido normal <MathFormula tex="\mathcal{N}(0, \sigma^2 \mathbf{I})" />: pasos cortos frecuentes y saltos amplios ocasionales.
            </p>
          </InteractiveCard>
        </div>

        <InteractiveCard
          title="Ergodicidad de la Cadena de Markov"
          subtitle="Accesibilidad global garantizada"
          badge="Teorema"
          icon={<InfinityIcon className="h-5 w-5" />}
          accent="emerald"
          active
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Con <MathFormula tex="p_m > 0" /> (o soporte gaussiano completo), la probabilidad de transición entre dos estados cualesquiera es estrictamente positiva: el algoritmo nunca queda atrapado irreversiblemente.
          </p>
        </InteractiveCard>

        <InteractiveCard
          title="Algoritmos Genéticos Adaptativos (AGAs)"
          subtitle="Control dinámico de p_c y p_m en tiempo real"
          badge={agaEnabled ? 'AGA Activo' : 'Estático'}
          accent="amber"
          active={agaEnabled}
          onClick={() => setAgaEnabled((v) => !v)}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Si la varianza de aptitud cae (riesgo de convergencia prematura), AGA eleva{' '}
            <MathFormula tex="p_m" /> y reduce <MathFormula tex="p_c" />; si la población es diversa, intensifica la explotación.
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

      {/* Right 6 Cols: Interactive MutationAgaSVG */}
      <div className="col-span-6 flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
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
