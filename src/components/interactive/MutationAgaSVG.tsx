import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useSlideKeyboard } from '../../hooks/useSlideKeyboard';
import { ParameterSlider } from '../ui/ParameterSlider';
import { createMulberry32 } from '../../utils/prng';

export interface MutationAgaSVGProps {
  sigma: number;
  onSigmaChange: (sigma: number) => void;
  agaEnabled: boolean;
  onToggleAga: () => void;
}

const BASE_BITS = [1, 0, 1, 1, 0, 0, 1, 0];

export function MutationAgaSVG({
  sigma,
  onSigmaChange,
  agaEnabled,
  onToggleAga,
}: MutationAgaSVGProps) {
  const rngRef = useRef(createMulberry32(61209));
  const [pm, setPm] = useState<number>(0.15);
  const [bits, setBits] = useState<number[]>(BASE_BITS);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([2]);
  const [popVariance, setPopVariance] = useState<number>(0.32); // 0.05 (collapsed) .. 1.0 (diverse)
  const [sampleOffset, setSampleOffset] = useState<number>(0.38);

  // Dynamic AGA adjustment: as population variance drops, p_m rises and p_c drops
  const effectivePm = agaEnabled
    ? Math.min(0.45, Math.max(0.04, 0.42 * (1 - popVariance) + 0.04))
    : pm;
  const effectivePc = agaEnabled
    ? Math.min(0.95, Math.max(0.45, 0.45 + 0.5 * popVariance))
    : 0.8;

  const gaussianPoints = useMemo(() => {
    return Array.from({ length: 49 }, (_, i) => {
      const x = -2.2 + (i / 48) * 4.4;
      const density =
        Math.exp(-(x * x) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
      return { x, density };
    });
  }, [sigma]);

  const maxDensity = Math.max(...gaussianPoints.map((p) => p.density), 0.1);
  const pathD = gaussianPoints
    .map((pt, i) => {
      const px = 20 + ((pt.x + 2.2) / 4.4) * 380;
      const py = 114 - (pt.density / maxDensity) * 94;
      return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(' ');

  const sampleX = 20 + ((Math.max(-2.1, Math.min(2.1, sampleOffset)) + 2.2) / 4.4) * 380;

  const executeMutation = () => {
    const rng = rngRef.current;
    const flipped: number[] = [];
    const nextBits = bits.map((b, i) => {
      if (rng() < effectivePm) {
        flipped.push(i);
        return b === 1 ? 0 : 1;
      }
      return b;
    });
    if (flipped.length === 0) {
      const forced = Math.floor(rng() * nextBits.length);
      nextBits[forced] = nextBits[forced] === 1 ? 0 : 1;
      flipped.push(forced);
    }
    setBits(nextBits);
    setFlippedIndices(flipped);

    // Box-Muller Gaussian sample
    const u1 = Math.max(1e-6, rng());
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    setSampleOffset(z * sigma);
  };

  useSlideKeyboard({
    onAction: executeMutation,
  });

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Action */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
            Bit-Flip · Gaussiana N(0, σ²) · Modo AGA
          </span>
          <h3 className="text-lg font-bold text-black">
            Perturbación &amp; Control Adaptativo
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAga}
            onKeyDown={(e) => e.stopPropagation()}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              agaEnabled
                ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            AGA: {agaEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={executeMutation}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-600 bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-violet-700 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            Mutar
          </button>
        </div>
      </div>

      {/* Bit-flip Row */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-bold text-violet-700">
            1. Bit-Flip (p_m = {effectivePm.toFixed(2)})
          </span>
          <span className="font-mono font-semibold text-slate-700">
            Mutados: {flippedIndices.length > 0 ? flippedIndices.map((i) => `b${i}`).join(', ') : 'ninguno'}
          </span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {bits.map((b, i) => {
            const wasFlipped = flippedIndices.includes(i);
            return (
              <motion.div
                key={`${i}-${b}-${flippedIndices.join(',')}`}
                initial={wasFlipped ? { scale: 1.18 } : false}
                animate={{ scale: 1 }}
                transition={{ duration: 0.22 }}
                className={`flex h-10 items-center justify-center rounded-lg border font-mono text-base font-bold ${
                  wasFlipped
                    ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                {b}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gaussian Bell Curve SVG */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
        <svg viewBox="0 0 420 135" className="h-full w-full">
          <line x1="20" y1="114" x2="400" y2="114" stroke="#64748b" strokeWidth="1.2" />
          <line x1="210" y1="14" x2="210" y2="114" stroke="rgba(124,58,237,0.35)" strokeDasharray="4 4" />
          <motion.path
            d={pathD}
            animate={{ d: pathD }}
            transition={{ duration: 0.25 }}
            fill="none"
            stroke="#0891b2"
            strokeWidth="2.8"
          />
          <motion.line
            x1={sampleX}
            y1="26"
            x2={sampleX}
            y2="114"
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="3 2"
            animate={{ x1: sampleX, x2: sampleX }}
          />
          <motion.circle
            cx={sampleX}
            cy="114"
            r="5"
            fill="#d97706"
            stroke="#ffffff"
            strokeWidth="1.2"
            animate={{ cx: sampleX }}
          />
          <text x="210" y="130" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            ε ~ N(0, σ²) · muestra actual ε = {sampleOffset.toFixed(2)}
          </text>
        </svg>
      </div>

      {/* Sliders: p_m / sigma / Variance for AGA */}
      <div className="grid grid-cols-2 gap-2">
        <ParameterSlider
          label="Tasa base bit-flip"
          symbol="p_m"
          value={pm}
          min={0.02}
          max={0.4}
          step={0.02}
          accent="violet"
          disabled={agaEnabled}
          formatValue={(v) => v.toFixed(2)}
          onChange={setPm}
        />
        <ParameterSlider
          label="Desviación gaussiana"
          symbol="\sigma"
          value={sigma}
          min={0.15}
          max={1.2}
          step={0.05}
          accent="cyan"
          formatValue={(v) => v.toFixed(2)}
          onChange={onSigmaChange}
        />
      </div>

      <div className="grid grid-cols-12 items-center gap-2">
        <div className="col-span-7">
          <ParameterSlider
            label="Varianza poblacional Var(f)"
            value={popVariance}
            min={0.05}
            max={1.0}
            step={0.05}
            accent="amber"
            formatValue={(v) => (v < 0.35 ? `${v.toFixed(2)} (Baja)` : `${v.toFixed(2)} (Alta)`)}
            onChange={setPopVariance}
          />
        </div>
        <div className="col-span-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <div className="flex justify-between">
            <span className="font-medium text-slate-700">p_c adaptado:</span>
            <span className="font-mono font-bold text-cyan-700">{effectivePc.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="font-medium text-slate-700">p_m adaptado:</span>
            <span className="font-mono font-bold text-amber-700">{effectivePm.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
