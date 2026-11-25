import { useEffect, useMemo, useRef, useState } from 'react';
import { Snowflake } from 'lucide-react';
import { ParameterSlider } from '../ui/ParameterSlider';
import { createMulberry32 } from '../../utils/prng';

export interface ExplorationBalanceSVGProps {
  balance: number; // 0 = extreme exploitation, 50 = balanced, 100 = extreme exploration
  onBalanceChange: (value: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const GLOBAL_OPT = { x: 295, y: 92 };
const LOCAL_TRAP_1 = { x: 102, y: 152 };
const LOCAL_TRAP_2 = { x: 158, y: 60 };

export function ExplorationBalanceSVG({
  balance,
  onBalanceChange,
}: ExplorationBalanceSVGProps) {
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  const initialParticles = useMemo<Particle[]>(() => {
    const rng = createMulberry32(77119);
    return Array.from({ length: 24 }, () => ({
      x: 40 + rng() * 340,
      y: 35 + rng() * 160,
      vx: (rng() - 0.5) * 2.2,
      vy: (rng() - 0.5) * 2.2,
    }));
  }, []);

  const particlesRef = useRef<Particle[]>(initialParticles.map((p) => ({ ...p })));
  const [renderParticles, setRenderParticles] = useState<Particle[]>(initialParticles);

  useEffect(() => {
    let frameId = 0;
    let tick = 0;
    const rng = createMulberry32(99103);

    const step = () => {
      tick += 1;
      const b = balanceRef.current;

      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i];

        if (b < 32) {
          // Extreme exploitation: collapse onto nearest local trap
          const d1 = Math.hypot(p.x - LOCAL_TRAP_1.x, p.y - LOCAL_TRAP_1.y);
          const d2 = Math.hypot(p.x - LOCAL_TRAP_2.x, p.y - LOCAL_TRAP_2.y);
          const target = d1 <= d2 ? LOCAL_TRAP_1 : LOCAL_TRAP_2;
          const jitter = 0.25 + (b / 32) * 0.6;
          p.vx = p.vx * 0.78 + (target.x - p.x) * 0.065 + (rng() - 0.5) * jitter;
          p.vy = p.vy * 0.78 + (target.y - p.y) * 0.065 + (rng() - 0.5) * jitter;
        } else if (b > 68) {
          // Extreme exploration: erratic random walk
          const amp = 1.6 + ((b - 68) / 32) * 2.6;
          p.vx = p.vx * 0.72 + (rng() - 0.5) * amp;
          p.vy = p.vy * 0.72 + (rng() - 0.5) * amp;
        } else {
          // Balanced zone: escape local traps and converge around global optimum
          const spreadFactor = 0.8 + ((b - 32) / 36) * 0.9;
          const orbitAngle = tick * 0.03 + i * 0.55;
          const orbitR = 14 + (i % 4) * 5 * spreadFactor;
          const tx = GLOBAL_OPT.x + Math.cos(orbitAngle) * orbitR;
          const ty = GLOBAL_OPT.y + Math.sin(orbitAngle) * orbitR;
          p.vx = p.vx * 0.82 + (tx - p.x) * 0.045 + (rng() - 0.5) * 0.9;
          p.vy = p.vy * 0.82 + (ty - p.y) * 0.045 + (rng() - 0.5) * 0.9;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 20) {
          p.x = 20;
          p.vx *= -0.7;
        } else if (p.x > 400) {
          p.x = 400;
          p.vx *= -0.7;
        }
        if (p.y < 20) {
          p.y = 20;
          p.vy *= -0.7;
        } else if (p.y > 210) {
          p.y = 210;
          p.vy *= -0.7;
        }
      }

      if (tick % 2 === 0) {
        setRenderParticles(pts.map((p) => ({ ...p })));
      }
      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const regime =
    balance < 32
      ? {
          label: 'Convergencia Prematura',
          accent: 'rose' as const,
          color: '#fb7185',
          desc: 'Presión selectiva extrema: la población colapsa en el óptimo local más cercano y pierde diversidad.',
        }
      : balance > 68
        ? {
            label: 'Paseo Aleatorio (Deriva)',
            accent: 'amber' as const,
            color: '#fbbf24',
            desc: 'Tasa de mutación descontrolada: las partículas vagan erráticamente sin consolidar ninguna cuenca.',
          }
        : {
            label: 'Equilibrio Estocástico',
            accent: 'emerald' as const,
            color: '#34d399',
            desc: 'Balance óptimo: la población escapa de las trampas locales y converge al óptimo global x*.',
          };

  const variance = useMemo(() => {
    const meanX = renderParticles.reduce((a, p) => a + p.x, 0) / renderParticles.length;
    const meanY = renderParticles.reduce((a, p) => a + p.y, 0) / renderParticles.length;
    const varSum =
      renderParticles.reduce(
        (a, p) => a + (p.x - meanX) ** 2 + (p.y - meanY) ** 2,
        0,
      ) / renderParticles.length;
    return Math.sqrt(varSum);
  }, [renderParticles]);

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Mapa Multimodal 2D (24 Partículas · 60 FPS)
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            Régimen: {regime.label}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/85 px-3 py-1 font-mono text-xs text-slate-200">
          <Snowflake className="h-3.5 w-3.5 text-cyan-300" />
          σ_pop = {variance.toFixed(1)}
        </span>
      </div>

      {/* Contour Map SVG */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800/90 bg-[#050816]">
        <svg viewBox="0 0 420 230" className="h-full w-full">
          {/* Subtle grid */}
          <line x1="20" y1="115" x2="400" y2="115" stroke="rgba(148,163,184,0.1)" strokeDasharray="3 3" />
          <line x1="210" y1="15" x2="210" y2="215" stroke="rgba(148,163,184,0.1)" strokeDasharray="3 3" />

          {/* Local Trap 1 */}
          <circle cx={LOCAL_TRAP_1.x} cy={LOCAL_TRAP_1.y} r="48" fill="rgba(251,113,133,0.08)" stroke="rgba(251,113,133,0.32)" strokeDasharray="4 4" />
          <circle cx={LOCAL_TRAP_1.x} cy={LOCAL_TRAP_1.y} r="25" fill="rgba(251,113,133,0.14)" stroke="rgba(251,113,133,0.45)" />
          <circle cx={LOCAL_TRAP_1.x} cy={LOCAL_TRAP_1.y} r="4" fill="#fb7185" />
          <text x={LOCAL_TRAP_1.x} y={LOCAL_TRAP_1.y + 62} textAnchor="middle" fill="#fda4af" fontSize="10.5" fontWeight="600">
            Trampa Local 1
          </text>

          {/* Local Trap 2 */}
          <circle cx={LOCAL_TRAP_2.x} cy={LOCAL_TRAP_2.y} r="36" fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.28)" strokeDasharray="4 4" />
          <circle cx={LOCAL_TRAP_2.x} cy={LOCAL_TRAP_2.y} r="17" fill="rgba(251,191,36,0.14)" />
          <circle cx={LOCAL_TRAP_2.x} cy={LOCAL_TRAP_2.y} r="3.5" fill="#fbbf24" />
          <text x={LOCAL_TRAP_2.x} y={LOCAL_TRAP_2.y - 42} textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="600">
            Trampa Local 2
          </text>

          {/* Global Optimum */}
          <circle cx={GLOBAL_OPT.x} cy={GLOBAL_OPT.y} r="68" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.28)" strokeDasharray="4 4" />
          <circle cx={GLOBAL_OPT.x} cy={GLOBAL_OPT.y} r="42" fill="rgba(52,211,153,0.11)" stroke="rgba(52,211,153,0.42)" />
          <circle cx={GLOBAL_OPT.x} cy={GLOBAL_OPT.y} r="18" fill="rgba(52,211,153,0.2)" />
          <circle cx={GLOBAL_OPT.x} cy={GLOBAL_OPT.y} r="5.5" fill="#34d399" />
          <text x={GLOBAL_OPT.x} y={GLOBAL_OPT.y + 82} textAnchor="middle" fill="#6ee7b7" fontSize="11.5" fontWeight="700">
            Óptimo Global x*
          </text>

          {/* Animated Particles */}
          {renderParticles.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={idx < 3 ? 5 : 4}
              fill={regime.color}
              stroke="#f8fafc"
              strokeWidth="1"
              opacity={0.9}
            />
          ))}
        </svg>
      </div>

      {/* Slider & Status */}
      <div className="space-y-2">
        <ParameterSlider
          label="Presión de Selección vs. Tasa de Mutación"
          value={balance}
          min={0}
          max={100}
          step={1}
          unit="%"
          accent={regime.accent}
          formatValue={(v) =>
            v < 32 ? `${v}% (Explotación)` : v > 68 ? `${v}% (Exploración)` : `${v}% (Equilibrio)`
          }
          onChange={onBalanceChange}
        />
        <p className="rounded-xl border border-slate-800 bg-slate-950/75 px-3.5 py-2 text-xs text-slate-300">
          {regime.desc}
        </p>
      </div>
    </div>
  );
}
