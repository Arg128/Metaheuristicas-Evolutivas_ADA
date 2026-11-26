import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Cpu, SlidersHorizontal, Sparkles } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { PaperExcerpt, PaperTermHighlight } from '../components/ui/PaperExcerpt';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const SYNTHESIS_CARDS = [
  {
    title: '1. Sin Gradiente',
    badge: 'Versatilidad',
    accent: 'cyan' as const,
    icon: Compass,
    body: 'Resuelven espacios multimodales y no derivables.',
  },
  {
    title: '2. Desacople y Balance',
    badge: 'Arquitectura',
    accent: 'violet' as const,
    icon: Cpu,
    body: 'Genotipo G / Fenotipo F con elitismo protector.',
  },
  {
    title: '3. Límites Claros',
    badge: 'Rigor',
    accent: 'amber' as const,
    icon: Sparkles,
    body: 'Dominados por C_fit; fallan en paisajes planos.',
  },
  {
    title: '4. Hiperparámetros',
    badge: 'N, p_c, p_m',
    accent: 'rose' as const,
    icon: SlidersHorizontal,
    body: 'Calibración manual costosa → automatizar diseño.',
  },
];

export function Slide19Closing({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="La sensibilidad a N, p_c y p_m impulsa el paso hacia las Hiperheurísticas: dejar que los algoritmos diseñen algoritmos."
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
              <p className="text-[15px] font-medium leading-snug text-[#1B365D]">{card.body}</p>
            </InteractiveCard>
          );
        })}
      </div>

      {/* Bottom Ascending Bridge SVG + Hiperheurísticas PaperExcerpt */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-5">
        <div className="col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Puente hacia la Siguiente Exposición
              </span>
              <h3 className="text-lg font-bold text-black">
                De Metaheurísticas a Hiperheurísticas
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Meta-Nivel
            </span>
          </div>

          <svg viewBox="0 0 760 190" className="my-1 w-full">
            <path
              d="M 190 120 Q 380 42 545 64"
              fill="none"
              stroke="rgba(225,29,72,0.45)"
              strokeWidth="3.2"
              strokeDasharray="6 5"
            />
            <motion.circle
              r="6"
              fill="#e11d48"
              animate={{
                cx: [190, 365, 545],
                cy: [120, 62, 64],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <g transform="translate(18, 104)">
              <rect width="205" height="68" rx="12" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.8" />
              <text x="102" y="28" textAnchor="middle" fill="#0e7490" fontSize="13.5" fontWeight="800">
                Metaheurísticas Evolutivas
              </text>
              <text x="102" y="50" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">
                Buscan en espacio de soluciones
              </text>
            </g>

            <g transform="translate(260, 108)">
              <rect width="225" height="48" rx="10" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
              <text x="112" y="21" textAnchor="middle" fill="#b45309" fontSize="12.5" fontWeight="800">
                Superar ajuste manual (N, p_c, p_m)
              </text>
              <text x="112" y="38" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600">
                Selección y generación automática
              </text>
            </g>

            <g transform="translate(515, 20)">
              <rect width="228" height="86" rx="14" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.2" />
              <text x="114" y="29" textAnchor="middle" fill="#be123c" fontSize="14" fontWeight="800">
                Hiperheurísticas &amp; Auto-Diseño
              </text>
              <text x="114" y="51" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="600">
                Buscan en espacio de heurísticas
              </text>
              <text x="114" y="71" textAnchor="middle" fill="#e11d48" fontSize="12" fontWeight="700">
                “Algoritmos que diseñan algoritmos”
              </text>
            </g>
          </svg>
        </div>

        <div className="col-span-5 flex flex-col gap-3.5">
          <PaperExcerpt
            category="Definición de Hiperheurística (Burke et al., 2013; Cruz-Duarte et al., 2021)"
            sourceTag="[R10] SWEVO · [R18] JORS"
            formulaTex={meta.keyFormula?.tex}
            equationNumber="(5)"
            className="flex flex-1 flex-col justify-center"
          >
            Una hiperheurística automatiza la{' '}
            <PaperTermHighlight>búsqueda en el espacio de heurísticas</PaperTermHighlight>{' '}
            para elegir o generar operadores adaptados a cada problema.
          </PaperExcerpt>

          <div className="flex flex-1 flex-col justify-center rounded-2xl border border-rose-200 bg-rose-50/90 p-5">
            <p className="text-base font-bold text-rose-900">
              Siguiente lámina: Referencias Bibliográficas (Slide 20)
            </p>
            <p className="mt-1 text-sm font-medium text-[#1B365D] leading-snug">
              Grupo 7 · Análisis y Diseño de Algoritmos · UNSA. Todas las fuentes verificadas con DOI disponibles en la lámina final.
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
