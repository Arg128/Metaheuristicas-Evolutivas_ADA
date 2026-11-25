import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Users } from 'lucide-react';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SemanticAccent, SlideMeta, ThematicBlock } from '../types/presentation';
import { getAccentStyle, getBlockAccent } from '../utils/accentStyles';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const STORAGE_KEY = 'metaheuristicas_grupo7_members';

const DEFAULT_MEMBERS = [
  'Integrante 1 — Ing. de Sistemas',
  'Integrante 2 — Ing. de Sistemas',
  'Integrante 3 — Ing. de Sistemas',
  'Integrante 4 — Ing. de Sistemas',
];

const THEMATIC_BLOCKS: { block: ThematicBlock; range: string; label: string }[] = [
  { block: 'Fundamentos y Taxonomía', range: '01 – 05', label: 'Fundamentos' },
  { block: 'Operadores Evolutivos', range: '06 – 12', label: 'Operadores' },
  { block: 'Simulación y Comparativa', range: '13 – 14', label: 'Simulador 2D' },
  { block: 'Análisis y Límites', range: '15 – 17', label: 'Complejidad' },
  { block: 'Aplicaciones y Cierre', range: '18 – 19', label: 'Ingeniería' },
];

const ORBITAL_PARTICLES = [
  { rx: 220, ry: 120, rot: -18, duration: 16, delay: 0, color: '#22d3ee', r: 5 },
  { rx: 175, ry: 95, rot: 24, duration: 13, delay: 0.8, color: '#a78bfa', r: 4.5 },
  { rx: 135, ry: 72, rot: -35, duration: 10.5, delay: 1.4, color: '#34d399', r: 4 },
  { rx: 95, ry: 52, rot: 12, duration: 8.5, delay: 0.3, color: '#fbbf24', r: 3.5 },
  { rx: 260, ry: 148, rot: 8, duration: 20, delay: 1.9, color: '#fb7185', r: 4 },
];

function loadSavedMembers(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MEMBERS;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed.length > 0 ? parsed : DEFAULT_MEMBERS;
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_MEMBERS;
}

export function Slide01Cover({ meta, totalSlides }: SlideProps) {
  const [members, setMembers] = useState<string[]>(loadSavedMembers);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
      // Ignore storage write errors
    }
  }, [members]);

  const updateMember = (idx: number, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? value : m)));
  };

  const addMember = () => {
    setMembers((prev) => [...prev, `Integrante ${prev.length + 1}`]);
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  };

  return (
    <SlideLayout meta={meta} totalSlides={totalSlides} variant="cover">
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/80 bg-[#090d1f]/75 p-10 backdrop-blur-md">
        {/* Animated Orbital Evolutionary Trajectories Converging Toward (0,0) */}
        <svg
          viewBox="-340 -220 680 440"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] opacity-75"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="cover-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Coordinate crosshair centered at (0,0) */}
          <circle cx="0" cy="0" r="190" fill="url(#cover-core-glow)" />
          <line x1="-290" y1="0" x2="290" y2="0" stroke="rgba(148,163,184,0.14)" strokeDasharray="4 6" />
          <line x1="0" y1="-190" x2="0" y2="190" stroke="rgba(148,163,184,0.14)" strokeDasharray="4 6" />

          {/* Concentric fitness contours */}
          {[50, 100, 155, 215].map((radius) => (
            <circle
              key={radius}
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke="rgba(56, 189, 248, 0.14)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          ))}

          {/* Converging elliptical evolutionary trajectories */}
          {ORBITAL_PARTICLES.map((orb, idx) => (
            <g key={idx} transform={`rotate(${orb.rot})`}>
              <ellipse
                cx="0"
                cy="0"
                rx={orb.rx}
                ry={orb.ry}
                fill="none"
                stroke={orb.color}
                strokeOpacity="0.24"
                strokeWidth="1.4"
                strokeDasharray="6 6"
              />
              <motion.circle
                r={orb.r}
                fill={orb.color}
                animate={{
                  cx: [orb.rx, 0, -orb.rx, 0, orb.rx],
                  cy: [0, orb.ry, 0, -orb.ry, 0],
                  opacity: [0.45, 0.95, 0.75, 0.95, 0.45],
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

          {/* Global optimum (0,0) beacon */}
          <motion.circle
            cx="0"
            cy="0"
            r="14"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            animate={{ r: [10, 22, 10], opacity: [0.9, 0.15, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="0" cy="0" r="6" fill="#34d399" />
          <text
            x="14"
            y="-10"
            fill="#a7f3d0"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="600"
          >
            x* = (0, 0)
          </text>
        </svg>

        {/* Top Course Header */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-4 py-1.5">
            <GraduationCap className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold tracking-wider text-cyan-200 uppercase">
              Análisis y Diseño de Algoritmos · UNSA · Grupo 7
            </span>
          </div>
          <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3.5 py-1 font-mono text-xs text-slate-300">
            19 Diapositivas · Nivel Ingeniería
          </span>
        </div>

        {/* Center Hero + Editable Team Card */}
        <div className="relative z-10 my-auto grid grid-cols-12 items-center gap-8">
          <div className="col-span-7 space-y-5">
            <div>
              <p className="mb-2 font-mono text-xs font-semibold tracking-[0.22em] text-cyan-300 uppercase">
                Optimización Estocástica Poblacional
              </p>
              <h1 className="bg-gradient-to-r from-slate-50 via-cyan-100 to-violet-200 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent leading-[1.06]">
                Metaheurísticas Evolutivas
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300 leading-relaxed">
                De los operadores estocásticos y la dualidad genotipo-fenotipo hasta
                simulaciones en vivo para problemas complejos de ingeniería y
                optimización continua o combinatoria.
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

          {/* Editable Group 7 Panel */}
          <div className="col-span-5 rounded-2xl border border-slate-700/80 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-500/15 text-cyan-300">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">
                    Integrantes del Grupo 7
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Editable en vivo · guardado en este navegador
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/35 bg-cyan-500/15 px-2.5 py-1 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar integrante
              </button>
            </div>

            <div className="max-h-[210px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder={`Nombre del integrante ${index + 1}`}
                    aria-label={`Integrante ${index + 1}`}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    disabled={members.length <= 1}
                    title="Eliminar integrante"
                    aria-label={`Eliminar integrante ${index + 1}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition-colors hover:border-rose-500/40 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom 5 Thematic Blocks Strip */}
        <div className="relative z-10 grid grid-cols-5 gap-3 pr-44">
          {THEMATIC_BLOCKS.map((item, idx) => {
            const accent: SemanticAccent = getBlockAccent(item.block);
            const style = getAccentStyle(accent);
            return (
              <div
                key={item.block}
                className={`rounded-xl border ${style.border} bg-slate-900/75 px-3.5 py-2.5 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[11px] font-bold ${style.text}`}>
                    B{idx + 1} · {item.range}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${style.trackBg}`} />
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-slate-100">
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
