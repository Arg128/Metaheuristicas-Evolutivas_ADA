import { useMemo, useState } from 'react';
import { Activity, Compass, Cpu } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
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
    criterion: 'Búsqueda',
    exact: 'Enumeración o Branch & Bound.',
    heuristic: 'Reglas voraces específicas.',
    evolutionary: 'Población con selección y cruce.',
  },
  {
    criterion: 'Gradiente',
    exact: 'Exige derivadas o convexidad.',
    heuristic: 'Sin gradiente, reglas ad-hoc.',
    evolutionary: 'Caja negra: solo evalúa f(x).',
  },
  {
    criterion: 'Escalabilidad',
    exact: 'Explosión O(2ⁿ) en NP-duros.',
    heuristic: 'Rápida O(n log n), poco flexible.',
    evolutionary: 'Acotada O(g_max · N · C_fit).',
  },
  {
    criterion: 'Garantía',
    exact: 'Óptimo global si logra terminar.',
    heuristic: 'Sin garantía; atrapada local.',
    evolutionary: 'Cuasi-óptimo robusto multimodal.',
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
    summary: 'Óptimo garantizado, colapsa en O(2ⁿ).',
  },
  {
    id: 'heuristic',
    label: 'Heurística',
    accent: 'amber',
    summary: 'Muy veloz, limitada a un dominio.',
  },
  {
    id: 'evolutionary',
    label: 'Metaheurística Evolutiva',
    accent: 'cyan',
    summary: 'Generalista, sin derivadas y escalable.',
  },
];

export function Slide02Paradigms({ meta, totalSlides }: SlideProps) {
  const [selectedParadigm, setSelectedParadigm] = useState<ParadigmId>('evolutionary');
  const [highlightRow, setHighlightRow] = useState<number>(2);
  const [nDimension, setNDimension] = useState<number>(18);

  const paradigmOrder: ParadigmId[] = ['exact', 'heuristic', 'evolutionary'];

  useSlideKeyboard({
    onNextState: () =>
      setSelectedParadigm((prev) => {
        const idx = paradigmOrder.indexOf(prev);
        return paradigmOrder[(idx + 1) % paradigmOrder.length];
      }),
    onPrevState: () =>
      setSelectedParadigm((prev) => {
        const idx = paradigmOrder.indexOf(prev);
        return paradigmOrder[(idx - 1 + paradigmOrder.length) % paradigmOrder.length];
      }),
    onSelectNumber: (idx) => {
      if (idx < paradigmOrder.length) setSelectedParadigm(paradigmOrder[idx]);
    },
  });

  const chartGeometry = useMemo(() => {
    const W = 460;
    const H = 210;
    const padL = 42;
    const padR = 16;
    const padT = 18;
    const padB = 34;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const minN = 4;
    const maxN = 28;
    const toX = (n: number) => padL + ((n - minN) / (maxN - minN)) * innerW;

    const exactCost = (n: number) =>
      Math.min(100, (Math.pow(2, n / 3.6) / Math.pow(2, maxN / 3.6)) * 100);
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
      keyTakeaway="Cuando O(2ⁿ) invalida los métodos exactos y faltan gradientes, el enfoque evolutivo acota el costo en O(g_max · N · C_fit)."
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
              <p className="text-[14px] font-medium text-[#1B365D] leading-snug">{p.summary}</p>
            </InteractiveCard>
          ))}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <table className="h-full w-full border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/90 text-xs font-bold uppercase tracking-wider text-slate-700">
                <th className="px-4 py-3">Criterio</th>
                <th
                  className={`px-3.5 py-3 ${
                    selectedParadigm === 'exact' ? 'bg-rose-50 text-rose-800' : ''
                  }`}
                >
                  Exacto
                </th>
                <th
                  className={`px-3.5 py-3 ${
                    selectedParadigm === 'heuristic' ? 'bg-amber-50 text-amber-800' : ''
                  }`}
                >
                  Heurística
                </th>
                <th
                  className={`px-3.5 py-3 ${
                    selectedParadigm === 'evolutionary' ? 'bg-cyan-50 text-cyan-800' : ''
                  }`}
                >
                  Metaheurística
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROWS.map((row, idx) => {
                const isActive = highlightRow === idx;
                return (
                  <tr
                    key={row.criterion}
                    onClick={() => setHighlightRow(idx)}
                    onMouseEnter={() => setHighlightRow(idx)}
                    className={`cursor-pointer transition-colors ${
                      isActive ? 'bg-slate-100/75' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold text-black align-top">
                      {row.criterion}
                    </td>
                    <td
                      className={`px-3.5 py-3.5 text-[14.5px] leading-snug align-top ${
                        selectedParadigm === 'exact'
                          ? 'bg-rose-50/80 font-semibold text-rose-900'
                          : 'text-[#1B365D]'
                      }`}
                    >
                      {row.exact}
                    </td>
                    <td
                      className={`px-3.5 py-3.5 text-[14.5px] leading-snug align-top ${
                        selectedParadigm === 'heuristic'
                          ? 'bg-amber-50/80 font-semibold text-amber-900'
                          : 'text-[#1B365D]'
                      }`}
                    >
                      {row.heuristic}
                    </td>
                    <td
                      className={`px-3.5 py-3.5 text-[14.5px] leading-snug align-top ${
                        selectedParadigm === 'evolutionary'
                          ? 'bg-cyan-50/80 font-semibold text-cyan-900'
                          : 'text-[#1B365D]'
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
        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                Escalabilidad Empírica
              </span>
              <h3 className="text-lg font-bold text-black">
                Explosión O(2ⁿ) vs. Presupuesto Evolutivo
              </h3>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1 font-mono text-sm font-bold text-cyan-800">
              <Cpu className="h-4 w-4" />
              n = {nDimension}
            </div>
          </div>

          <svg viewBox={`0 0 ${chartGeometry.W} ${chartGeometry.H}`} className="my-1 w-full">
            <line
              x1={chartGeometry.padL}
              y1={chartGeometry.padT}
              x2={chartGeometry.padL}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <line
              x1={chartGeometry.padL}
              y1={chartGeometry.padT + chartGeometry.innerH}
              x2={chartGeometry.padL + chartGeometry.innerW}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            <path d={chartGeometry.exactPath} fill="none" stroke="#e11d48" strokeWidth="3.2" />
            <path d={chartGeometry.evoPath} fill="none" stroke="#0891b2" strokeWidth="3.2" />
            <path
              d={chartGeometry.heurPath}
              fill="none"
              stroke="#d97706"
              strokeWidth="2.2"
              strokeDasharray="5 4"
            />

            <line
              x1={chartGeometry.markerX}
              y1={chartGeometry.padT}
              x2={chartGeometry.markerX}
              y2={chartGeometry.padT + chartGeometry.innerH}
              stroke="rgba(71,85,105,0.45)"
              strokeDasharray="3 3"
            />
            <circle cx={chartGeometry.markerX} cy={chartGeometry.markerExactY} r="5.5" fill="#e11d48" />
            <circle cx={chartGeometry.markerX} cy={chartGeometry.markerEvoY} r="5.5" fill="#0891b2" />

            <text x={chartGeometry.padL + 10} y={chartGeometry.padT + 16} fill="#e11d48" fontSize="13" fontWeight="700">
              Exacto: O(2ⁿ)
            </text>
            <text x={chartGeometry.padL + 10} y={chartGeometry.padT + 35} fill="#0891b2" fontSize="13" fontWeight="700">
              Evolutivo: O(g_max · N · C_fit)
            </text>
            <text
              x={chartGeometry.padL + chartGeometry.innerW / 2}
              y={chartGeometry.H - 7}
              textAnchor="middle"
              fill="#334155"
              fontSize="12.5"
              fontWeight="600"
            >
              Dimensión del problema (n variables)
            </text>
          </svg>

          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Activity className="h-4 w-4 text-cyan-700" />
                Instancia (n)
              </span>
              <span className="font-mono text-slate-700">
                2ⁿ ≈ <strong className="text-rose-700">{chartGeometry.exactLabel}</strong> ops
              </span>
            </div>
            <div className="relative flex h-5 items-center">
              <div className="pointer-events-none absolute inset-x-0 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-cyan-600 transition-[width] duration-75"
                  style={{ width: `${((nDimension - 6) / 20) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min={6}
                max={26}
                step={1}
                value={nDimension}
                onChange={(e) => setNDimension(Number(e.target.value))}
                onKeyDown={(e) => e.stopPropagation()}
                className="meta-slider relative z-10 w-full"
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Exacto: colapso exponencial</span>
              <span className="flex items-center gap-1 font-bold text-cyan-700">
                <Compass className="h-3.5 w-3.5" /> Evolutivo: ~{chartGeometry.evoLabel} evals
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
