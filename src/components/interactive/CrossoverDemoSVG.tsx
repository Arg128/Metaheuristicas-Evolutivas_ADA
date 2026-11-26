import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Shuffle, Sparkles } from 'lucide-react';
import { createMulberry32 } from '../../utils/prng';

export type CrossoverMode = '1-point' | '2-point' | 'uniform';

export interface CrossoverDemoSVGProps {
  mode: CrossoverMode;
  onModeChange: (mode: CrossoverMode) => void;
}

const PARENT_1 = ['1', '0', '1', '1', '0', '0', '1', '0'];
const PARENT_2 = ['0', '1', '0', '0', '1', '1', '0', '1'];

export function CrossoverDemoSVG({ mode, onModeChange }: CrossoverDemoSVGProps) {
  const rngRef = useRef(createMulberry32(41905));
  const [cut1, setCut1] = useState<number>(3);
  const [cut2, setCut2] = useState<number>(6);
  const [mask, setMask] = useState<number[]>([1, 1, 0, 1, 0, 0, 1, 0]);
  const [recombStep, setRecombStep] = useState<number>(1);

  const executeRecombination = () => {
    const rng = rngRef.current;
    if (mode === '1-point') {
      const nextCut = 1 + Math.floor(rng() * 7); // 1..7
      setCut1(nextCut);
    } else if (mode === '2-point') {
      const a = 1 + Math.floor(rng() * 5); // 1..5
      const b = a + 1 + Math.floor(rng() * (7 - a)); // a+1..7
      setCut1(a);
      setCut2(b);
    } else {
      setMask(Array.from({ length: 8 }, () => (rng() < 0.5 ? 1 : 0)));
    }
    setRecombStep((s) => s + 1);
  };

  const offspring = useMemo(() => {
    return PARENT_1.map((_, idx) => {
      let fromP1 = true;
      if (mode === '1-point') {
        fromP1 = idx < cut1;
      } else if (mode === '2-point') {
        fromP1 = !(idx >= cut1 && idx < cut2);
      } else {
        fromP1 = mask[idx] === 1;
      }
      return {
        idx,
        h1Bit: fromP1 ? PARENT_1[idx] : PARENT_2[idx],
        h1Origin: fromP1 ? 'P1' : 'P2',
        h2Bit: fromP1 ? PARENT_2[idx] : PARENT_1[idx],
        h2Origin: fromP1 ? 'P2' : 'P1',
      };
    });
  }, [mode, cut1, cut2, mask]);

  // Holland short building block check: e.g. genes 0..2 from P1 preserved intact in H1 or H2
  const blockPreserved = useMemo(() => {
    if (mode === '1-point') return cut1 >= 3;
    if (mode === '2-point') return cut1 >= 3 || cut2 <= 5;
    return (mask[0] === mask[1] && mask[1] === mask[2]);
  }, [mode, cut1, cut2, mask]);

  const cellX = (idx: number) => 56 + idx * 46;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Mode Selector */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Recombinación Cromosómica Animada
          </span>
          <h3 className="text-base font-bold text-slate-900">
            {mode === '1-point'
              ? `Cruce en 1 Punto (k = ${cut1})`
              : mode === '2-point'
                ? `Cruce en 2 Puntos (k₁ = ${cut1}, k₂ = ${cut2})`
                : 'Cruce Uniforme (Máscara Estocástica)'}
          </h3>
        </div>

        <button
          type="button"
          onClick={executeRecombination}
          onKeyDown={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-violet-600 bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 cursor-pointer"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Ejecutar Recombinación
        </button>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { id: '1-point', label: '1 Punto' },
            { id: '2-point', label: '2 Puntos' },
            { id: 'uniform', label: 'Uniforme' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onModeChange(item.id)}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === item.id
                ? 'border-violet-500 bg-violet-50 text-violet-900 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scissors className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* SVG Chromosome Recombination Diagram */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
        <svg viewBox="0 0 435 236" className="h-full w-full">
          {/* Building Block Highlight Window (1 * 1 * * * * *) */}
          <rect
            x={cellX(0) - 4}
            y="14"
            width="136"
            height="86"
            rx="8"
            fill={blockPreserved ? 'rgba(5,150,105,0.08)' : 'rgba(225,29,72,0.07)'}
            stroke={blockPreserved ? '#059669' : '#e11d48'}
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text
            x={cellX(0) + 64}
            y="11"
            textAnchor="middle"
            fill={blockPreserved ? '#047857' : '#be123c'}
            fontSize="8.5"
            fontWeight="700"
          >
            Esquema H = 101***** (δ=2)
          </text>

          {/* P1 Row */}
          <text x="12" y="40" fill="#0e7490" fontSize="11" fontWeight="700">
            P1
          </text>
          {PARENT_1.map((bit, i) => (
            <g key={`p1-${i}`} transform={`translate(${cellX(i)}, 20)`}>
              <rect
                width="38"
                height="30"
                rx="6"
                fill="#ecfeff"
                stroke="#0891b2"
                strokeWidth="1.3"
              />
              <text x="19" y="20" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">
                {bit}
              </text>
            </g>
          ))}

          {/* P2 Row */}
          <text x="12" y="82" fill="#6d28d9" fontSize="11" fontWeight="700">
            P2
          </text>
          {PARENT_2.map((bit, i) => (
            <g key={`p2-${i}`} transform={`translate(${cellX(i)}, 62)`}>
              <rect
                width="38"
                height="30"
                rx="6"
                fill="#f5f3ff"
                stroke="#7c3aed"
                strokeWidth="1.3"
              />
              <text x="19" y="20" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">
                {bit}
              </text>
            </g>
          ))}

          {/* Cut Lines */}
          {mode === '1-point' ? (
            <motion.line
              x1={cellX(cut1) - 4}
              y1="14"
              x2={cellX(cut1) - 4}
              y2="220"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="5 3"
              animate={{ x1: cellX(cut1) - 4, x2: cellX(cut1) - 4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            />
          ) : null}

          {mode === '2-point' ? (
            <>
              <motion.line
                x1={cellX(cut1) - 4}
                y1="14"
                x2={cellX(cut1) - 4}
                y2="220"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="5 3"
                animate={{ x1: cellX(cut1) - 4, x2: cellX(cut1) - 4 }}
              />
              <motion.line
                x1={cellX(cut2) - 4}
                y1="14"
                x2={cellX(cut2) - 4}
                y2="220"
                stroke="#0891b2"
                strokeWidth="2"
                strokeDasharray="5 3"
                animate={{ x1: cellX(cut2) - 4, x2: cellX(cut2) - 4 }}
              />
            </>
          ) : null}

          {/* Flow Divider */}
          <line x1="12" y1="112" x2="420" y2="112" stroke="#cbd5e1" strokeWidth="1.2" />
          <text x="218" y="126" textAnchor="middle" fill="#475569" fontSize="9.5" fontWeight="600">
            {mode === 'uniform'
              ? `Máscara binaria: [ ${mask.join(' ')} ]`
              : 'Herencia cruzada de segmentos parentales'}
          </text>

          {/* Offspring H1 */}
          <text x="12" y="158" fill="#047857" fontSize="11" fontWeight="700">
            H1
          </text>
          {offspring.map((gene, i) => {
            const fromP1 = gene.h1Origin === 'P1';
            return (
              <motion.g
                key={`h1-${recombStep}-${i}`}
                initial={{ y: fromP1 ? -18 : -8, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                transform={`translate(${cellX(i)}, 138)`}
              >
                <rect
                  width="38"
                  height="32"
                  rx="6"
                  fill={fromP1 ? '#cffafe' : '#ede9fe'}
                  stroke={fromP1 ? '#0891b2' : '#7c3aed'}
                  strokeWidth="1.5"
                />
                <text x="19" y="18" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="800">
                  {gene.h1Bit}
                </text>
                <text x="19" y="28" textAnchor="middle" fill={fromP1 ? '#0e7490' : '#6d28d9'} fontSize="7.5" fontWeight="700">
                  {gene.h1Origin}
                </text>
              </motion.g>
            );
          })}

          {/* Offspring H2 */}
          <text x="12" y="203" fill="#047857" fontSize="11" fontWeight="700">
            H2
          </text>
          {offspring.map((gene, i) => {
            const fromP1 = gene.h2Origin === 'P1';
            return (
              <motion.g
                key={`h2-${recombStep}-${i}`}
                initial={{ y: -12, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                transform={`translate(${cellX(i)}, 182)`}
              >
                <rect
                  width="38"
                  height="32"
                  rx="6"
                  fill={fromP1 ? '#cffafe' : '#ede9fe'}
                  stroke={fromP1 ? '#0891b2' : '#7c3aed'}
                  strokeWidth="1.5"
                />
                <text x="19" y="18" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="800">
                  {gene.h2Bit}
                </text>
                <text x="19" y="28" textAnchor="middle" fill={fromP1 ? '#0e7490' : '#6d28d9'} fontSize="7.5" fontWeight="700">
                  {gene.h2Origin}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Holland Building Block Status */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
        <span className="inline-flex items-center gap-1.5 text-slate-700">
          <Sparkles className={`h-3.5 w-3.5 ${blockPreserved ? 'text-emerald-700' : 'text-rose-700'}`} />
          Bloque de construcción <code className="rounded bg-emerald-50 px-1 font-mono font-semibold text-emerald-800">101*****</code>:
        </span>
        <span className={`font-semibold ${blockPreserved ? 'text-emerald-700' : 'text-rose-700'}`}>
          {blockPreserved ? 'Preservado intacto en descendencia' : 'Fragmentado por el corte'}
        </span>
      </div>
    </div>
  );
}
