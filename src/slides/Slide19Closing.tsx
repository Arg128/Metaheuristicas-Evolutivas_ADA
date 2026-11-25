import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Cpu, SlidersHorizontal, Sparkles } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const SYNTHESIS_CARDS = [
  {
    title: '1. Eficacia sin Gradiente',
    badge: 'Versatilidad',
    accent: 'cyan' as const,
    icon: Compass,
    body: 'Resuelven problemas complejos de ingeniería y optimización continua o combinatoria en espacios multimodales y no derivables.',
  },
  {
    title: '2. Desacople y Equilibrio',
    badge: 'Arquitectura',
    accent: 'violet' as const,
    icon: Cpu,
    body: 'Separar genotipo G y fenotipo F permite equilibrar exploración (mutación) y explotación (selección) con elitismo protector.',
  },
  {
    title: '3. Límites Claros',
    badge: 'Rigor',
    accent: 'amber' as const,
    icon: Sparkles,
    body: 'Su costo está dominado por C_fit, requieren señal diferencial (fallan en paisajes planos) y exigen codificaciones como Gray.',
  },
  {
    title: '4. Sensibilidad Paramétrica',
    badge: 'N, p_c, p_m',
    accent: 'rose' as const,
    icon: SlidersHorizontal,
    body: 'Calibrar manualmente N, p_c, p_m y elegir el operador correcto es costoso y motiva automatizar el diseño algorítmico.',
  },
];

export function Slide19Closing({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="La sensibilidad a hiperparámetros (N, p_c, p_m) impulsa el salto natural hacia las Hiperheurísticas: dejar que los algoritmos diseñen algoritmos."
    >
      {/* Top 4 Synthesis Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        {SYNTHESIS_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <InteractiveCard
              key={card.title}
              title={card.title}
              badge={card.badge}
              icon={<Icon className="h-5 w-5" />}
              accent={card.accent}
              className="!p-4"
            >
              <p className="text-xs text-slate-300 leading-relaxed">{card.body}</p>
            </InteractiveCard>
          );
        })}
      </div>

      {/* Bottom Ascending Bridge SVG + Hiperheurísticas Formula */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-5">
        <div className="col-span-8 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Puente hacia la Siguiente Exposición
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                De Metaheurísticas Evolutivas a Hiperheurísticas
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-200">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Meta-Nivel
            </span>
          </div>

          <svg viewBox="0 0 760 190" className="my-1 w-full">
            {/* Ascending Bridge Arc */}
            <path
              d="M 190 120 Q 380 42 545 64"
              fill="none"
              stroke="rgba(251,113,133,0.45)"
              strokeWidth="3"
              strokeDasharray="6 5"
            />
            <motion.circle
              r="5.5"
              fill="#fb7185"
              animate={{
                cx: [190, 365, 545],
                cy: [120, 62, 64],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Level 1: Espacio de Soluciones */}
            <g transform="translate(20, 108)">
              <rect width="190" height="64" rx="12" fill="#090d1f" stroke="#22d3ee" strokeWidth="1.8" />
              <text x="95" y="27" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="700">
                Metaheurísticas Evolutivas
              </text>
              <text x="95" y="47" textAnchor="middle" fill="#cbd5e1" fontSize="11">
                Buscan en espacio de soluciones
              </text>
            </g>

            {/* Bridge Label */}
            <g transform="translate(260, 105)">
              <rect width="225" height="44" rx="10" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.2" />
              <text x="112" y="20" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700">
                Superar ajuste manual (N, p_c, p_m)
              </text>
              <text x="112" y="35" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">
                Selección y generación automática
              </text>
            </g>

            {/* Level 2: Hiperheurísticas */}
            <g transform="translate(525, 22)">
              <rect width="215" height="82" rx="14" fill="rgba(251,113,133,0.15)" stroke="#fb7185" strokeWidth="2.2" />
              <text x="107" y="28" textAnchor="middle" fill="#fecdd3" fontSize="13" fontWeight="800">
                Hiperheurísticas &amp; Auto-Diseño
              </text>
              <text x="107" y="49" textAnchor="middle" fill="#f8fafc" fontSize="11">
                Buscan en espacio de heurísticas
              </text>
              <text x="107" y="67" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="600">
                “Dejar que los algoritmos diseñen algoritmos”
              </text>
            </g>
          </svg>
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-3">
          {meta.keyFormula ? (
            <MathFormula
              tex={meta.keyFormula.tex}
              label={meta.keyFormula.label}
              block
              highlight
              accent="rose"
            />
          ) : null}

          <div className="flex flex-1 flex-col justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
            <p className="text-sm font-bold text-rose-100">
              ¡Muchas gracias por su atención!
            </p>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Grupo 7 · Análisis y Diseño de Algoritmos · UNSA. Preguntas y demostración en vivo disponibles sobre cualquiera de las 19 diapositivas.
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
