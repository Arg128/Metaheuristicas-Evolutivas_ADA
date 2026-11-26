import { useState } from 'react';
import { motion } from 'framer-motion';

type CostProfile = 'analytic' | 'fea' | 'cfd';

interface Segment {
  key: string;
  label: string;
  pct: number;
  color: string;
}

const PROFILE_DATA: Record<
  CostProfile,
  {
    title: string;
    totalProjected: string;
    perGen: string;
    note: string;
    segments: Segment[];
  }
> = {
  analytic: {
    title: 'Analítica O(1) (ej. Rastrigin)',
    totalProjected: '~0.04 s (100 gens × N=50)',
    perGen: '~0.4 ms / gen',
    note: 'Con funciones cerradas rápidas, los operadores O(N·L) representan casi la mitad del ciclo.',
    segments: [
      { key: 'fit', label: 'Evaluación C_fit', pct: 56, color: '#d97706' },
      { key: 'sel', label: 'Selección', pct: 12, color: '#7c3aed' },
      { key: 'cross', label: 'Cruce', pct: 14, color: '#0891b2' },
      { key: 'mut', label: 'Mutación', pct: 11, color: '#059669' },
      { key: 'init', label: 'Inicialización / Elitismo', pct: 7, color: '#64748b' },
    ],
  },
  fea: {
    title: 'FEA Media (Elementos Finitos)',
    totalProjected: '~20 min (100 gens × N=50)',
    perGen: '~12 s / gen',
    note: 'Resolver mallas estructurales absorbe ~91% del presupuesto computacional por generación.',
    segments: [
      { key: 'fit', label: 'Evaluación C_fit (FEA)', pct: 91, color: '#d97706' },
      { key: 'sel', label: 'Selección', pct: 2.5, color: '#7c3aed' },
      { key: 'cross', label: 'Cruce', pct: 3.0, color: '#0891b2' },
      { key: 'mut', label: 'Mutación', pct: 2.0, color: '#059669' },
      { key: 'init', label: 'Inicialización / Elitismo', pct: 1.5, color: '#64748b' },
    ],
  },
  cfd: {
    title: 'CFD Intensiva (>95% Navier-Stokes)',
    totalProjected: '~7.5 h (100 gens × N=50)',
    perGen: '~4.5 min / gen',
    note: 'Cada evaluación C_fit domina >97%; la paralelización por individuo en clúster es indispensable.',
    segments: [
      { key: 'fit', label: 'Evaluación C_fit (CFD)', pct: 97.2, color: '#d97706' },
      { key: 'sel', label: 'Selección', pct: 0.8, color: '#7c3aed' },
      { key: 'cross', label: 'Cruce', pct: 0.9, color: '#0891b2' },
      { key: 'mut', label: 'Mutación', pct: 0.6, color: '#059669' },
      { key: 'init', label: 'Inicialización / Elitismo', pct: 0.5, color: '#64748b' },
    ],
  },
};

export function ComplexityDonutSVG() {
  const [profile, setProfile] = useState<CostProfile>('fea');
  const active = PROFILE_DATA[profile];

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Compute cumulative offsets for multi-segment animated donut
  let offsetAccum = 0;
  const arcs = active.segments.map((seg) => {
    const length = (seg.pct / 100) * circumference;
    const dashOffset = -offsetAccum;
    offsetAccum += length;
    return { ...seg, length, dashOffset };
  });

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Desglose del Ciclo Evolutivo (g_max=100, N=50)
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Perfilado Temporal: {active.title}
          </h3>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-bold text-amber-800">
          {active.perGen}
        </span>
      </div>

      {/* Cost Profile Selector */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { id: 'analytic', label: 'Analítica O(1)' },
            { id: 'fea', label: 'FEA Media' },
            { id: 'cfd', label: 'CFD Intensiva >95%' },
          ] as const
        ).map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setProfile(btn.id)}
            onKeyDown={(e) => e.stopPropagation()}
            className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              profile === btn.id
                ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Animated SVG Donut + Breakdown Legend */}
      <div className="my-auto grid grid-cols-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="col-span-5 flex flex-col items-center">
          <svg viewBox="0 0 180 180" className="h-44 w-44">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="22" />
            {arcs.map((arc) => (
              <motion.circle
                key={arc.key}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="22"
                transform="rotate(-90 90 90)"
                initial={false}
                animate={{
                  strokeDasharray: `${arc.length} ${circumference}`,
                  strokeDashoffset: arc.dashOffset,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            <text x="90" y="85" textAnchor="middle" fill="#b45309" fontSize="22" fontWeight="800">
              {active.segments[0].pct}%
            </text>
            <text x="90" y="104" textAnchor="middle" fill="#475569" fontSize="10.5" fontWeight="600">
              Costo C_fit
            </text>
          </svg>
        </div>

        <div className="col-span-7 space-y-1.5 text-xs">
          {active.segments.map((seg) => (
            <div
              key={seg.key}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5"
            >
              <span className="flex items-center gap-2 text-slate-700">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                {seg.label}
              </span>
              <span className="font-mono font-bold text-slate-900">{seg.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projected Runtime Callout */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
        <span className="text-slate-700">{active.note}</span>
        <span className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono font-bold text-amber-800">
          {active.totalProjected}
        </span>
      </div>
    </div>
  );
}
