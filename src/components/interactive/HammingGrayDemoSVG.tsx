import { motion } from 'framer-motion';
import { Binary, ChevronLeft, ChevronRight } from 'lucide-react';
import { ParameterSlider } from '../ui/ParameterSlider';
import { binaryToGray, formatBits, hammingDistance } from '../../utils/prng';

export interface HammingGrayDemoSVGProps {
  value: number;
  onChange: (val: number) => void;
}

export function HammingGrayDemoSVG({ value, onChange }: HammingGrayDemoSVGProps) {
  const currVal = Math.max(0, Math.min(14, value));
  const nextVal = currVal + 1;

  const binA = formatBits(currVal, 4);
  const binB = formatBits(nextVal, 4);
  const grayAInt = binaryToGray(currVal);
  const grayBInt = binaryToGray(nextVal);
  const grayA = formatBits(grayAInt, 4);
  const grayB = formatBits(grayBInt, 4);

  const distBin = hammingDistance(currVal, nextVal);
  const distGray = hammingDistance(grayAInt, grayBInt);

  const isCriticalWall = currVal === 7;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Quick Jump & Stepper */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Comparador 0..15 · Transición Adyacente
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            Entero {currVal} → {nextVal}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, currVal - 1))}
            onKeyDown={(e) => e.stopPropagation()}
            className="rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.min(14, currVal + 1))}
            onKeyDown={(e) => e.stopPropagation()}
            className="rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(7)}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              isCriticalWall
                ? 'border-amber-400 bg-amber-500/25 text-amber-100'
                : 'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
            }`}
          >
            <Binary className="h-3.5 w-3.5" />
            Ver Salto Crítico 7 → 8
          </button>
        </div>
      </div>

      {/* Bit-Flip Comparison Boxes */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Standard Binary */}
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-200">Binario Estándar</span>
            <span className="font-mono font-bold text-rose-300">
              d_H = {distBin} {distBin >= 3 ? '(Pared de Hamming)' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 font-mono text-base font-bold">
            <div className="flex gap-1.5">
              {binA.split('').map((b, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-200"
                >
                  {b}
                </span>
              ))}
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex gap-1.5">
              {binB.split('').map((b, i) => {
                const changed = b !== binA[i];
                return (
                  <motion.span
                    key={`${currVal}-bin-${i}`}
                    initial={changed ? { scale: 1.18 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      changed
                        ? 'border-rose-400 bg-rose-500/30 text-white shadow-[0_0_10px_rgba(251,113,133,0.35)]'
                        : 'border-slate-700 bg-slate-950 text-slate-400'
                    }`}
                  >
                    {b}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gray Code */}
        <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-200">Código Gray G = B ⊕ (B ≫ 1)</span>
            <span className="font-mono font-bold text-emerald-300">
              d_H = {distGray} (Adyacencia unitaria)
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 font-mono text-base font-bold">
            <div className="flex gap-1.5">
              {grayA.split('').map((b, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-200"
                >
                  {b}
                </span>
              ))}
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex gap-1.5">
              {grayB.split('').map((b, i) => {
                const changed = b !== grayA[i];
                return (
                  <motion.span
                    key={`${currVal}-gray-${i}`}
                    initial={changed ? { scale: 1.18 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      changed
                        ? 'border-emerald-400 bg-emerald-500/30 text-white shadow-[0_0_10px_rgba(52,211,153,0.35)]'
                        : 'border-slate-700 bg-slate-950 text-slate-400'
                    }`}
                  >
                    {b}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Neighbor Graph SVG across 0..15 */}
      <div className="rounded-xl border border-slate-800 bg-[#050816] p-2">
        <svg viewBox="0 0 420 74" className="h-[72px] w-full">
          <text x="12" y="14" fill="#94a3b8" fontSize="9" fontWeight="600">
            Grafo de vecindad fenotípica (0 → 15): costo en bits por paso
          </text>
          {Array.from({ length: 16 }, (_, n) => {
            const x = 18 + n * 25.5;
            const isCurr = n === currVal;
            const isNext = n === nextVal;
            const edgeDist = n < 15 ? hammingDistance(n, n + 1) : 1;
            return (
              <g key={n}>
                {n < 15 ? (
                  <line
                    x1={x}
                    y1="42"
                    x2={x + 25.5}
                    y2="42"
                    stroke={isCurr ? '#fbbf24' : edgeDist >= 3 ? '#fb7185' : '#334155'}
                    strokeWidth={isCurr ? 2.5 : edgeDist >= 3 ? 2 : 1.2}
                  />
                ) : null}
                <circle
                  cx={x}
                  cy="42"
                  r={isCurr || isNext ? 8.5 : 6}
                  fill={isCurr ? '#fbbf24' : isNext ? '#34d399' : '#0f172a'}
                  stroke={isCurr ? '#fde68a' : isNext ? '#6ee7b7' : '#475569'}
                  strokeWidth="1.3"
                  className="cursor-pointer"
                  onClick={() => onChange(Math.min(14, n))}
                />
                <text
                  x={x}
                  y="45"
                  textAnchor="middle"
                  fill={isCurr || isNext ? '#050816' : '#cbd5e1'}
                  fontSize="8"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {n}
                </text>
              </g>
            );
          })}
          <text x="210" y="67" textAnchor="middle" fill="#94a3b8" fontSize="9">
            Binario: {distBin} bit{distBin > 1 ? 's' : ''} (p_m^{distBin}) · Gray: 1 bit (p_m^1)
          </text>
        </svg>
      </div>

      <ParameterSlider
        label="Selector entero B"
        symbol="B"
        value={currVal}
        min={0}
        max={14}
        step={1}
        accent="amber"
        formatValue={(v) => `${v} → ${v + 1}`}
        onChange={onChange}
      />
    </div>
  );
}
