import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SemanticAccent, SlideMeta } from '../types/presentation';
import { getAccentStyle } from '../utils/accentStyles';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const TEAM_MEMBERS = [
  'Maritza Claudia Marron Puma',
  'Fredy José Aragón Carpio',
  'Jhoans Anthony Huanca Lupaca',
  'Ángel Julio Retamozo Calatayud',
];

const SECTIONS: {
  range: string;
  label: string;
  accent: SemanticAccent;
}[] = [
  {
    range: 'Diaps. 01 – 05',
    label: 'Fundamentos y Taxonomía',
    accent: 'cyan',
  },
  {
    range: 'Diaps. 06 – 10',
    label: 'Familias y Operadores',
    accent: 'violet',
  },
  {
    range: 'Diaps. 11 – 14',
    label: 'Ejecución y Simulador 2D',
    accent: 'emerald',
  },
  {
    range: 'Diaps. 15 – 20',
    label: 'Costos, Límites y Cierre',
    accent: 'amber',
  },
];

const ORBITAL_PARTICLES = [
  { rx: 220, ry: 120, rot: -18, duration: 16, delay: 0, color: '#0891b2', r: 5 },
  { rx: 175, ry: 95, rot: 24, duration: 13, delay: 0.8, color: '#7c3aed', r: 4.5 },
  { rx: 135, ry: 72, rot: -35, duration: 10.5, delay: 1.4, color: '#059669', r: 4 },
  { rx: 95, ry: 52, rot: 12, duration: 8.5, delay: 0.3, color: '#d97706', r: 3.5 },
  { rx: 260, ry: 148, rot: 8, duration: 20, delay: 1.9, color: '#e11d48', r: 4 },
];

export function Slide01Cover({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout meta={meta} totalSlides={totalSlides} variant="cover">
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white/95 px-10 py-8 shadow-xl shadow-slate-900/5 backdrop-blur-md">
        {/* Animated Orbital Evolutionary Trajectories Converging Toward (0,0) */}
        <svg
          viewBox="-340 -220 680 440"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] opacity-75"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="cover-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.18" />
              <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="0" cy="0" r="190" fill="url(#cover-core-glow)" />
          <line x1="-290" y1="0" x2="290" y2="0" stroke="rgba(15,23,42,0.11)" strokeDasharray="4 6" />
          <line x1="0" y1="-190" x2="0" y2="190" stroke="rgba(15,23,42,0.11)" strokeDasharray="4 6" />

          {[50, 100, 155, 215].map((radius) => (
            <circle
              key={radius}
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke="rgba(8, 145, 178, 0.15)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          ))}

          {ORBITAL_PARTICLES.map((orb, idx) => (
            <g key={idx} transform={`rotate(${orb.rot})`}>
              <ellipse
                cx="0"
                cy="0"
                rx={orb.rx}
                ry={orb.ry}
                fill="none"
                stroke={orb.color}
                strokeOpacity="0.3"
                strokeWidth="1.4"
                strokeDasharray="6 6"
              />
              <motion.circle
                r={orb.r}
                fill={orb.color}
                animate={{
                  cx: [orb.rx, 0, -orb.rx, 0, orb.rx],
                  cy: [0, orb.ry, 0, -orb.ry, 0],
                  opacity: [0.55, 1, 0.8, 1, 0.55],
                }}
                transition={{
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: orb.delay,
                }}
              />
            </g>
          ))}

          <motion.circle
            cx="0"
            cy="0"
            r="14"
            fill="none"
            stroke="#059669"
            strokeWidth="1.6"
            animate={{ r: [10, 22, 10], opacity: [0.9, 0.18, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="0" cy="0" r="6" fill="#059669" />
          <text
            x="14"
            y="-10"
            fill="#047857"
            fontSize="13"
            fontFamily="monospace"
            fontWeight="700"
          >
            x* = (0, 0)
          </text>
        </svg>

        {/* Top Institutional Header: UNSA Crest + Hierarchy + Course/Professor */}
        <div className="relative z-10 flex items-center justify-between gap-6 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-4">
            <img
              src="/logo-unsa.jpg"
              alt="Escudo Universidad Nacional de San Agustín de Arequipa"
              className="h-20 w-auto shrink-0 object-contain mix-blend-multiply"
            />
            <div className="space-y-0.5 leading-tight">
              <p className="text-[16px] font-extrabold tracking-wide text-black uppercase">
                Universidad Nacional de San Agustín de Arequipa
              </p>
              <p className="text-[13.5px] font-bold tracking-wider text-[#1B365D] uppercase">
                Facultad de Producción y Servicios
              </p>
              <p className="text-[13.5px] font-semibold tracking-wider text-[#2E64B5] uppercase">
                Escuela Profesional de Ingeniería de Sistemas
              </p>
            </div>
          </div>

          <div className="shrink-0 space-y-1.5 border-l-2 border-[#2E64B5]/35 pl-5 text-right">
            <div>
              <span className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                Curso
              </span>
              <span className="text-[14.5px] font-extrabold text-black uppercase">
                Análisis y Diseño de Algoritmos
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                Docente
              </span>
              <span className="text-[14.5px] font-bold text-[#1B365D] uppercase">
                Norman Patrick Harvey Arce
              </span>
            </div>
          </div>
        </div>

        {/* Center Hero + Clean Team Card */}
        <div className="relative z-10 my-auto grid grid-cols-12 items-center gap-8 py-2">
          <div className="col-span-7 space-y-4">
            <div>
              <p className="mb-1.5 font-mono text-sm font-bold tracking-[0.2em] text-[#2E64B5] uppercase">
                Optimización Estocástica Poblacional
              </p>
              <h1 className="bg-gradient-to-r from-black via-[#1B365D] to-[#2E64B5] bg-clip-text text-[58px] font-extrabold tracking-tight text-transparent leading-[1.06]">
                Metaheurísticas Evolutivas
              </h1>
              <p className="mt-3 max-w-2xl text-[19px] font-medium text-[#1B365D] leading-relaxed">
                Del desacople genotipo–fenotipo y los operadores estocásticos hasta
                simulación en vivo, análisis de límites y casos reales.
              </p>
            </div>

            {meta.keyFormula ? (
              <div className="max-w-xl">
                <MathFormula
                  tex={meta.keyFormula.tex}
                  label={meta.keyFormula.label}
                  block
                  highlight
                  accent="cyan"
                />
              </div>
            ) : null}
          </div>

          {/* Clean Group 7 Panel */}
          <div className="col-span-5 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-md">
            <div className="mb-3.5 flex items-center gap-3 border-b border-slate-200/80 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-black">
                Integrantes · Grupo 7
              </h2>
            </div>

            <ul className="space-y-2.5">
              {TEAM_MEMBERS.map((member, index) => (
                <li
                  key={member}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/90 px-3.5 py-2.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white font-mono text-xs font-bold text-[#2E64B5] shadow-2xs ring-1 ring-slate-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[16px] font-semibold text-slate-900">
                    {member}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom 4 Thematic Sections Strip */}
        <div className="relative z-10 grid grid-cols-4 gap-3.5 pr-44">
          {SECTIONS.map((item) => {
            const style = getAccentStyle(item.accent);
            return (
              <div
                key={item.label}
                className={`rounded-xl border ${style.border} bg-white/95 px-4 py-2.5 shadow-xs backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${style.text}`}>
                    {item.range}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${style.trackBg}`} />
                </div>
                <p className="mt-1 truncate text-sm font-bold text-slate-900">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SlideLayout>
  );
}
