import { useMemo, useState } from 'react';
import { Activity, Compass, Cpu } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

type ParadigmId = 'exact' | 'heuristic' | 'evolutionary';

interface ComparisonRow {
  criterion: string;
  exact: string;
  heuristic: string;
  evolutionary: string;
}

const ROWS: ComparisonRow[] = [
  {
    criterion: 'Mecanismo de Búsqueda',
    exact: 'Enumeración sistemática, Branch & Bound o descenso analítico.',
    heuristic: 'Reglas voraces o constructivas diseñadas para un dominio puntual.',
    evolutionary: 'Población estocástica guiada por selección, cruce y mutación.',
  },
  {
    criterion: 'Necesidad de Gradiente',
    exact: 'Requiere derivabilidad / convexidad o partición estructurada.',
    heuristic: 'No requiere gradiente, pero depende de reglas ad-hoc del problema.',
    evolutionary: 'Libre de gradientes (caja negra): solo evalúa aptitud f(x).',
  },
  {
    criterion: 'Complejidad / Escalabilidad',
    exact: 'Explosión exponencial O(2^n) en instancias NP-duros.',
    evolutionary: 'Presupuesto acotado O(g_max · N · C_fit) independiente de gradiente.',
    heuristic: 'Polinomial muy rápida O(n log n), pero rígida ante cambios.',
  },
  {
    criterion: 'Garantía de Solución',
    exact: 'Óptimo global certificado si logra terminar en tiempo útil.',
    evolutionary: 'Soluciones cuasi-óptimas robustas con escape de óptimos locales.',
    heuristic: 'Sin garantía de optimalidad; propensa a mínimos locales tempranos.',
  },
];

const PARADIGMS: {
  id: ParadigmId;
  label: string;
  accent: 'rose' | 'amber' | 'cyan';
  summary: string;
}[] = [
  {
    id: 'exact',
    label: 'Algoritmo Exacto',
    accent: 'rose',
    summary: 'Garantía absoluta, pero colapso exponencial al crecer la dimensión n.',
  },
  {
    id: 'heuristic',
    label: 'Heurística Específica',
    accent: 'amber',
    summary: 'Velocidad inmediata para un caso concreto, baja transferibilidad.',
  },
  {
    id: 'evolutionary',
    label: 'Metaheurística Evolutiva',
    accent: 'cyan',
    summary: 'Marco generalista sin derivadas para paisajes multimodales complejos.',
  },
];

export function Slide02Paradigms({ meta, totalSlides }: SlideProps) {
  const [selectedParadigm, setSelectedParadigm] = useState<ParadigmId>('evolutionary');
  const [highlightRow, setHighlightRow] = useState<number>(2);
  const [nDimension, setNDimension] = useState<number>(18);

  const chartGeometry = useMemo(() => {
    const W = 460;
    const H = 220;
    const padL = 44;
    const padR = 16;
    const padT = 18;
    const padB = 34;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const minN = 4;
    const maxN = 28;
    const toX = (n: number) => padL + ((n - minN) / (maxN - minN)) * innerW;

    // Normalized visual scaling (0..100 cost units on log-like compressed axis for clarity)
    const exactCost = (n: number) => Math.min(100, (Math.pow(2, n / 3.6) / Math.pow(2, maxN / 3.6)) * 100);
    const evoCost = (n: number) => Math.min(48, 12 + n * 1.15);
    const heurCost = (n: number) => Math.min(22, 4 + n * 0.45);

    const toY = (val: number) => padT + innerH - (val / 100) * innerH;

    const samples = Array.from({ length: 25 }, (_, i) => minN + i);
    const buildPath = (fn: (n: number) => number) =>
      samples
        .map((n, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(n).toFixed(1)} ${toY(fn(n)).toFixed(1)}`)
        .join(' ');

    return {
      W,
      H,
      padL,
      padT,
      innerW,
      innerH,
      toX,
      toY,
      exactPath: buildPath(exactCost),
      evoPath: buildPath(evoCost),
      heurPath: buildPath(heurCost),
      markerX: toX(nDimension),
      markerExactY: toY(exactCost(nDimension)),
      markerEvoY: toY(evoCost(nDimension)),
      exactLabel: Math.round(Math.pow(2, nDimension)).toLocaleString('es-PE'),
      evoLabel: (nDimension * 1500).toLocaleString('es-PE'),
    };
  }, [nDimension]);

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="Cuando la explosión combinatoria O(2^n) invalida los métodos exactos y no existen gradientes analíticos, la búsqueda evolutiva acota el cómputo en O(g_max · N · C_fit)."
    >
      {/* Left 7 Cols: Interactive Comparison Table */}
      <div className="col-span-7 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2.5">
          {PARADIGMS.map((p) => (
            <InteractiveCard
              key={p.id}
              title={p.label}
              accent={p.accent}
              active={selectedParadigm === p.id}
              onClick={() => setSelectedParadigm(p.id)}
              className="!p-3.5"
            >
              <p className="text-xs text-slate-300 leading-snug">{p.summary}</p>
            </InteractiveCard>
          ))}
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-semibold">Criterio</th>
                <th
                  className={`px-4 py-3 font-semibold ${
                    selectedParadigm === 'exact' ? 'text-rose-300 bg-rose-500/10' : ''
                  }`}
                >
                  Exacto
                </th>
                <th
                  className={`px-4 py-3 font-semibold ${
                    selectedParadigm === 'heuristic' ? 'text-amber-300 bg-amber-500/10' : ''
                  }`}
                >
                  Heurística
                </th>
                <th
                  className={`px-4 py-3 font-semibold ${
                    selectedParadigm === 'evolutionary' ? 'text-cyan-300 bg-cyan-500/10' : ''
                  }`}
                >
                  Metaheurística Evolutiva
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {ROWS.map((row, idx) => {
                const isActive = highlightRow === idx;
                return (
                  <tr
                    key={row.criterion}
                    onClick={() => setHighlightRow(idx)}
                    onMouseEnter={() => setHighlightRow(idx)}
                    className={`cursor-pointer transition-colors ${
                      isActive ? 'bg-slate-800/55' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-100 align-top">
                      {row.criterion}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-xs leading-relaxed align-top ${
                        selectedParadigm === 'exact'
                          ? 'bg-rose-500/10 text-rose-100 font-medium'
                          : 'text-slate-300'
                      }`}
                    >
                      {row.exact}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-xs leading-relaxed align-top ${
                        selectedParadigm === 'heuristic'
                          ? 'bg-amber-500/10 text-amber-100 font-medium'
                          : 'text-slate-300'
                      }`}
                    >
                      {row.heuristic}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-xs leading-relaxed align-top ${
                        selectedParadigm === 'evolutionary'
                          ? 'bg-cyan-500/10 text-cyan-100 font-medium'
                          : 'text-slate-300'
                      }`}
                    >
                      {row.evolutionary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right 5 Cols: Interactive Complexity Growth Chart + MathFormula */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Escalabilidad Empírica
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Explosión O(2ⁿ) vs. Presupuesto Evolutivo
              </h3>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1 font-mono text-xs text-cyan-300">
              <Cpu className="h-3.5 w-3.5" />
              n = {nDimension}
            </div>
          </div>

          <svg viewBox={`0 0 ${chartGeometry.W} ${chartGeometry.H}`} className="my-2 w-full">
            {/* Axes */}
            <line
              x1={chartGeometry.padL}
              y1={chartGeometry.padT}
              x2={chartGeometry.padL}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="#475569"
              strokeWidth="1.5"
            />
            <line
              x1={chartGeometry.padL}
              y1={chartGeometry.padT + chartGeometry.innerH}
              x2={chartGeometry.padL + chartGeometry.innerW}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Curves */}
            <path d={chartGeometry.exactPath} fill="none" stroke="#fb7185" strokeWidth="3" />
            <path
              d={chartGeometry.evoPath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
            />
            <path
              d={chartGeometry.heurPath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="5 4"
            />

            {/* Vertical inspection cursor */}
            <line
              x1={chartGeometry.markerX}
              y1={chartGeometry.padT}
              x2={chartGeometry.markerX}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="rgba(148,163,184,0.45)"
              strokeDasharray="3 3"
            />
            <circle cx={chartGeometry.markerX} cy={chartGeometry.markerExactY} r="5" fill="#fb7185" />
            <circle cx={chartGeometry.markerX} cy={chartGeometry.markerEvoY} r="5" fill="#22d3ee" />

            {/* Labels */}
            <text x={chartGeometry.padL + 8} y={chartGeometry.padT + 14} fill="#fb7185" fontSize="11" fontWeight="600">
              Exacto: O(2^n)
            </text>
            <text x={chartGeometry.padL + 8} y={chartGeometry.padT + 30} fill="#22d3ee" fontSize="11" fontWeight="600">
              Evolutivo: O(g_max · N · C_fit)
            </text>
            <text
              x={chartGeometry.padL + chartGeometry.innerW / 2}
              y={chartGeometry.H - 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
            >
              Dimensión del problema (n variables)
            </text>
          </svg>

          {/* Interactive Dimension Scrubber */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/75 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Activity className="h-3.5 w-3.5 text-cyan-300" />
                Explorar tamaño de instancia (n)
              </span>
              <span className="font-mono text-slate-400">
                2ⁿ ≈ <strong className="text-rose-300">{chartGeometry.exactLabel}</strong> ops
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={26}
              step={1}
              value={nDimension}
              onChange={(e) => setNDimension(Number(e.target.value))}
              onKeyDown={(e) => e.stopPropagation()}
              className="meta-slider w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Exacto: colapso exponencial</span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Compass className="h-3 w-3" /> Evolutivo acotado: ~{chartGeometry.evoLabel} evals
              </span>
            </div>
          </div>
        </div>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="cyan"
          />
        ) : null}
      </div>
    </SlideLayout>
  );
}
