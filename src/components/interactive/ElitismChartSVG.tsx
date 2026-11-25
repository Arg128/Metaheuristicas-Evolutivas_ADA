import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { createMulberry32 } from '../../utils/prng';

export interface ElitismChartSVGProps {
  elitismOn: boolean;
  onToggleElitism: () => void;
}

interface GenStats {
  gen: number;
  withElitismMax: number;
  withoutElitismMax: number;
  avgFitness: number;
}

export function ElitismChartSVG({ elitismOn, onToggleElitism }: ElitismChartSVGProps) {
  const [runSeed, setRunSeed] = useState<number>(1);

  const series = useMemo<GenStats[]>(() => {
    const rng = createMulberry32(9001 + runSeed * 1337);
    const data: GenStats[] = [];

    let bestSoFar = 34;
    let avg = 18;

    for (let g = 0; g <= 30; g += 1) {
      const improvement = rng() < 0.42 ? rng() * 5.2 : 0;
      bestSoFar = Math.min(98, bestSoFar + improvement);

      // Without elitism, stochastic loss occurs ~30% of generations
      const stochasticDrop = g > 2 && rng() < 0.34 ? -(4 + rng() * 11) : 0;
      const noEliteMax = Math.max(avg + 2, bestSoFar + stochasticDrop);

      avg = Math.min(bestSoFar - 6, avg + 1.45 + (rng() - 0.35) * 2.2);

      data.push({
        gen: g,
        withElitismMax: bestSoFar,
        withoutElitismMax: noEliteMax,
        avgFitness: Math.max(10, avg),
      });
    }
    return data;
  }, [runSeed]);

  const toX = (g: number) => 42 + (g / 30) * 356;
  const toY = (val: number) => 182 - (val / 100) * 150;

  const maxCurvePath = useMemo(() => {
    return series
      .map((pt, i) => {
        const val = elitismOn ? pt.withElitismMax : pt.withoutElitismMax;
        return `${i === 0 ? 'M' : 'L'} ${toX(pt.gen).toFixed(1)} ${toY(val).toFixed(1)}`;
      })
      .join(' ');
  }, [series, elitismOn]);

  const avgCurvePath = useMemo(() => {
    return series
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(pt.gen).toFixed(1)} ${toY(pt.avgFitness).toFixed(1)}`)
      .join(' ');
  }, [series]);

  const ghostPath = useMemo(() => {
    return series
      .map((pt, i) => {
        const val = elitismOn ? pt.withoutElitismMax : pt.withElitismMax;
        return `${i === 0 ? 'M' : 'L'} ${toX(pt.gen).toFixed(1)} ${toY(val).toFixed(1)}`;
      })
      .join(' ');
  }, [series, elitismOn]);

  const finalPt = series[series.length - 1];
  const finalMax = elitismOn ? finalPt.withElitismMax : finalPt.withoutElitismMax;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Controls */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Convergencia en 30 Generaciones
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            {elitismOn
              ? 'Elitismo ON: Escalera Monótona No Degradante'
              : 'Elitismo OFF: Pérdida Estocástica de Líderes'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleElitism}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              elitismOn
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-rose-400 bg-rose-500/20 text-rose-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Elitismo: {elitismOn ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={() => setRunSeed((s) => s + 1)}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Nueva Simulación
          </button>
        </div>
      </div>

      {/* Animated SVG Chart */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-[#050816] p-2">
        <svg viewBox="0 0 420 212" className="h-full w-full">
          {/* Grid lines */}
          {[25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1="42"
                y1={toY(v)}
                x2="398"
                y2={toY(v)}
                stroke="rgba(148,163,184,0.12)"
                strokeDasharray="3 3"
              />
              <text x="36" y={toY(v) + 3.5} textAnchor="end" fill="#64748b" fontSize="9">
                {v}
              </text>
            </g>
          ))}

          <line x1="42" y1="24" x2="42" y2="182" stroke="#475569" strokeWidth="1.2" />
          <line x1="42" y1="182" x2="400" y2="182" stroke="#475569" strokeWidth="1.2" />

          {/* Ghost Reference */}
          <path
            d={ghostPath}
            fill="none"
            stroke="rgba(148,163,184,0.28)"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />

          {/* Average Fitness */}
          <motion.path
            key={`avg-${runSeed}`}
            d={avgCurvePath}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.2"
          />

          {/* Max Fitness */}
          <motion.path
            key={`max-${runSeed}-${elitismOn ? 'on' : 'off'}`}
            d={maxCurvePath}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            fill="none"
            stroke={elitismOn ? '#34d399' : '#fb7185'}
            strokeWidth="3"
          />

          {/* Highlight stochastic drops when OFF */}
          {!elitismOn &&
            series.map((pt, i) => {
              if (i === 0) return null;
              const prev = series[i - 1].withoutElitismMax;
              if (pt.withoutElitismMax < prev - 2) {
                return (
                  <circle
                    key={pt.gen}
                    cx={toX(pt.gen)}
                    cy={toY(pt.withoutElitismMax)}
                    r="4"
                    fill="#fb7185"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                );
              }
              return null;
            })}

          <text x="220" y="201" textAnchor="middle" fill="#94a3b8" fontSize="10.5">
            Generación g (0 → 30) · Semilla #{runSeed}
          </text>
        </svg>
      </div>

      {/* Legend & Telemetry */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/75 px-3 py-2">
          <span className={`block font-semibold ${elitismOn ? 'text-emerald-300' : 'text-rose-300'}`}>
            Aptitud Máxima
          </span>
          <span className="font-mono text-sm font-bold text-slate-100">
            {finalMax.toFixed(1)} pts
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/75 px-3 py-2">
          <span className="block font-semibold text-cyan-300">Aptitud Promedio</span>
          <span className="font-mono text-sm font-bold text-slate-100">
            {finalPt.avgFitness.toFixed(1)} pts
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/75 px-3 py-2">
          <span className="block font-semibold text-slate-400">Comportamiento</span>
          <span className="font-semibold text-slate-200">
            {elitismOn ? 'Monótono seguro' : 'Retrocesos activos'}
          </span>
        </div>
      </div>
    </div>
  );
}
