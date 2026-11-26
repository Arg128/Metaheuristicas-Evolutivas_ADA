import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, GitBranch, Sliders } from 'lucide-react';
import { useSlideKeyboard } from '../../hooks/useSlideKeyboard';
import { ParameterSlider } from '../ui/ParameterSlider';

type CodingMode = 'binary' | 'real' | 'tree';
const CODING_MODES: CodingMode[] = ['binary', 'real', 'tree'];

interface AstState {
  op: '+' | '*';
  left: 'sin(x)' | 'cos(x)';
  right: '0.5x' | '0.2x²';
}

export function GenotypePhenotypeLab() {
  const [mode, setMode] = useState<CodingMode>('binary');

  useSlideKeyboard({
    onNextState: () =>
      setMode((prev) => CODING_MODES[(CODING_MODES.indexOf(prev) + 1) % CODING_MODES.length]),
    onPrevState: () =>
      setMode(
        (prev) =>
          CODING_MODES[(CODING_MODES.indexOf(prev) - 1 + CODING_MODES.length) % CODING_MODES.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < CODING_MODES.length) setMode(CODING_MODES[idx]);
    },
  });
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1]);
  const [r1, setR1] = useState<number>(0.65);
  const [r2, setR2] = useState<number>(0.42);
  const [wingWidth, setWingWidth] = useState<number>(0.55);
  const [ast, setAst] = useState<AstState>({
    op: '+',
    left: 'sin(x)',
    right: '0.5x',
  });

  // Decode genotype -> geometric parameters & fitness f(phi(G)) in [0, 100]
  const decoded = useMemo(() => {
    if (mode === 'binary') {
      const camberBits = bits[0] * 2 + bits[1]; // 0..3
      const sweepBits = bits[2] * 2 + bits[3]; // 0..3
      const tipBits = bits[4] * 2 + bits[5]; // 0..3

      const camber = 14 + camberBits * 11; // 14..47
      const sweep = 18 + sweepBits * 14; // 18..60
      const tip = 8 + tipBits * 10; // 8..38

      // Smooth unimodal target around optimal aerodynamic profile (camber~36, sweep~46, tip~28)
      const err =
        Math.pow((camber - 36) / 22, 2) +
        Math.pow((sweep - 46) / 28, 2) +
        Math.pow((tip - 28) / 20, 2);
      const fitness = Math.max(12, Math.min(99.4, 98.5 - err * 44));
      return {
        camber,
        sweep,
        tip,
        fitness,
        genotypeStr: bits.join(' '),
        phenotypeStr: `Cuerda ${sweep + 85}mm · Curvatura ${camber}% · Winglet ${tip}°`,
      };
    }

    if (mode === 'real') {
      const camber = 12 + r1 * 38;
      const sweep = 15 + r2 * 45;
      const tip = 8 + wingWidth * 32;
      const err =
        Math.pow((r1 - 0.68) / 0.55, 2) +
        Math.pow((r2 - 0.55) / 0.55, 2) +
        Math.pow((wingWidth - 0.6) / 0.55, 2);
      const fitness = Math.max(15, Math.min(99.7, 99.1 - err * 46));
      return {
        camber,
        sweep,
        tip,
        fitness,
        genotypeStr: `[ ${r1.toFixed(2)}, ${r2.toFixed(2)}, ${wingWidth.toFixed(2)} ]`,
        phenotypeStr: `Perfil continuo (${r1.toFixed(2)}, ${r2.toFixed(2)}, w=${wingWidth.toFixed(2)})`,
      };
    }

    // Tree mode
    const camber = ast.left === 'sin(x)' ? 34 : 22;
    const sweep = ast.op === '+' ? 42 : 56;
    const tip = ast.right === '0.5x' ? 26 : 36;
    const bonus =
      (ast.op === '+' ? 32 : 20) +
      (ast.left === 'sin(x)' ? 34 : 24) +
      (ast.right === '0.5x' ? 30 : 22);
    return {
      camber,
      sweep,
      tip,
      fitness: Math.min(98.8, bonus),
      genotypeStr: `(${ast.op} ${ast.left} ${ast.right})`,
      phenotypeStr: `Contorno y(x) = ${ast.left} ${ast.op} ${ast.right}`,
    };
  }, [mode, bits, r1, r2, wingWidth, ast]);

  // Build SVG airfoil path based on decoded parameters
  const airfoilPath = useMemo(() => {
    const x0 = 32;
    const x1 = 230 + decoded.sweep * 0.65;
    const yBase = 108;
    const upperY = yBase - decoded.camber * 1.15;
    const lowerY = yBase + decoded.tip * 0.45;
    const tailY = yBase - decoded.tip * 0.32;
    return `M ${x0} ${yBase} C ${x0 + 48} ${upperY}, ${x1 - 65} ${upperY + 10}, ${x1} ${tailY} C ${x1 - 55} ${lowerY}, ${x0 + 55} ${lowerY - 6}, ${x0} ${yBase} Z`;
  }, [decoded]);

  const gaugeRadius = 34;
  const gaugeCirc = 2 * Math.PI * gaugeRadius;
  const gaugeDash = (decoded.fitness / 100) * gaugeCirc;

  const toggleBit = (index: number) => {
    setBits((prev) => prev.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)));
  };

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-3">
      {/* Header + Representation Selector */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Laboratorio Genotipo → Fenotipo
            </span>
            <h3 className="text-lg font-bold text-black">
              Morfogénesis en Tiempo Real φ(G)
            </h3>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-800">
            f = {decoded.fitness.toFixed(1)}%
          </span>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              { id: 'binary', label: 'Binaria (6 bits)', icon: Binary },
              { id: 'real', label: 'Vector Real', icon: Sliders },
              { id: 'tree', label: 'Árbol Sintáctico', icon: GitBranch },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                onKeyDown={(e) => e.stopPropagation()}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genotype Manipulation Area */}
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-800">
          <span>1. Genotipo Manipulable G</span>
          <span className="font-mono text-sm text-slate-800">{decoded.genotypeStr}</span>
        </div>

        {mode === 'binary' ? (
          <div className="space-y-1.5">
            <div className="grid grid-cols-6 gap-2">
              {bits.map((bit, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleBit(idx)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`flex h-12 flex-col items-center justify-center rounded-lg border font-mono text-lg font-bold transition-colors cursor-pointer ${
                    bit === 1
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>{bit}</span>
                  <span className="text-[10px] font-medium opacity-80">b{idx}</span>
                </motion.button>
              ))}
            </div>
            <p className="text-xs font-medium text-slate-600">
              Haz clic en un bit para mutar el genotipo y ver cambiar el perfil alar.
            </p>
          </div>
        ) : null}

        {mode === 'real' ? (
          <div className="grid grid-cols-3 gap-2">
            <ParameterSlider
              label="r₁"
              value={r1}
              min={0.1}
              max={1}
              step={0.05}
              accent="cyan"
              formatValue={(v) => v.toFixed(2)}
              onChange={setR1}
            />
            <ParameterSlider
              label="r₂"
              value={r2}
              min={0.1}
              max={1}
              step={0.05}
              accent="violet"
              formatValue={(v) => v.toFixed(2)}
              onChange={setR2}
            />
            <ParameterSlider
              label="w"
              value={wingWidth}
              min={0.1}
              max={1}
              step={0.05}
              accent="emerald"
              formatValue={(v) => v.toFixed(2)}
              onChange={setWingWidth}
            />
          </div>
        ) : null}

        {mode === 'tree' ? (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setAst((s) => ({ ...s, op: s.op === '+' ? '*' : '+' }))}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex-1 rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 font-mono text-xs font-bold text-violet-800 cursor-pointer hover:bg-violet-100"
            >
              Raíz: {ast.op}
            </button>
            <button
              type="button"
              onClick={() =>
                setAst((s) => ({ ...s, left: s.left === 'sin(x)' ? 'cos(x)' : 'sin(x)' }))
              }
              onKeyDown={(e) => e.stopPropagation()}
              className="flex-1 rounded-lg border border-cyan-300 bg-white px-3 py-2 font-mono text-xs font-bold text-cyan-800 cursor-pointer hover:bg-cyan-100"
            >
              Izq: {ast.left}
            </button>
            <button
              type="button"
              onClick={() =>
                setAst((s) => ({ ...s, right: s.right === '0.5x' ? '0.2x²' : '0.5x' }))
              }
              onKeyDown={(e) => e.stopPropagation()}
              className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 font-mono text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100"
            >
              Der: {ast.right}
            </button>
          </div>
        ) : null}
      </div>

      {/* Live SVG Phenotype + Fitness Gauge */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-violet-700">
              2. Fenotipo F = φ(G)
            </span>
            <span className="font-mono font-medium text-slate-700">{decoded.phenotypeStr}</span>
          </div>

          <svg viewBox="0 0 320 170" className="w-full flex-1">
            {/* Airflow streamlines */}
            {[42, 72, 108, 142].map((yPos, i) => (
              <motion.path
                key={yPos}
                d={`M 8 ${yPos} Q 145 ${yPos - (i === 1 ? decoded.camber * 0.45 : 4)} 312 ${yPos - 4}`}
                fill="none"
                stroke="rgba(8,145,178,0.28)"
                strokeWidth="1.4"
                strokeDasharray="6 5"
                animate={{ strokeDashoffset: [0, -22] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Morphing Airfoil */}
            <motion.path
              d={airfoilPath}
              animate={{ d: airfoilPath }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              fill="rgba(124,58,237,0.2)"
              stroke="#7c3aed"
              strokeWidth="2.4"
            />

            {/* AST subtle graph overlay when tree mode is active */}
            {mode === 'tree' ? (
              <motion.path
                d={`M 30 140 Q 115 ${ast.left === 'sin(x)' ? 50 : 120} 195 ${ast.op === '+' ? 75 : 135} T 290 ${ast.right === '0.5x' ? 62 : 112}`}
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            ) : null}

            {/* Center of Pressure Marker */}
            <circle cx={96 + decoded.sweep * 0.3} cy="100" r="4" fill="#0891b2" />
          </svg>
        </div>

        {/* Fitness Gauge */}
        <div className="col-span-4 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
          <span className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            3. Aptitud f(φ(G))
          </span>
          <svg viewBox="0 0 96 96" className="h-24 w-24">
            <circle cx="48" cy="48" r={gaugeRadius} fill="none" stroke="#e2e8f0" strokeWidth="9" />
            <motion.circle
              cx="48"
              cy="48"
              r={gaugeRadius}
              fill="none"
              stroke={decoded.fitness >= 80 ? '#059669' : decoded.fitness >= 55 ? '#0891b2' : '#d97706'}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={gaugeCirc}
              animate={{ strokeDashoffset: gaugeCirc - gaugeDash }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              transform="rotate(-90 48 48)"
            />
            <text x="48" y="48" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800">
              {decoded.fitness.toFixed(0)}
            </text>
            <text x="48" y="63" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="700">
              / 100 pts
            </text>
          </svg>
          <span className="mt-1 text-center text-xs font-semibold text-slate-700">
            {decoded.fitness >= 82 ? 'Alta eficiencia' : 'Búsqueda activa'}
          </span>
        </div>
      </div>
    </div>
  );
}
