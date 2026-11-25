import { useEffect, useMemo, useRef, useState } from 'react';
import { createMulberry32 } from '../../utils/prng';

export interface NeedleHaystackSVGProps {
  landscape: 'gradient' | 'flat';
  onLandscapeChange: (mode: 'gradient' | 'flat') => void;
}

interface Walker {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NEEDLE = { x: 265, y: 105 };

export function NeedleHaystackSVG({
  landscape,
  onLandscapeChange,
}: NeedleHaystackSVGProps) {
  const modeRef = useRef(landscape);
  modeRef.current = landscape;

  const initialWalkers = useMemo<Walker[]>(() => {
    const rng = createMulberry32(55219);
    return Array.from({ length: 20 }, () => ({
      x: 35 + rng() * 350,
      y: 28 + rng() * 165,
      vx: (rng() - 0.5) * 2.5,
      vy: (rng() - 0.5) * 2.5,
    }));
  }, []);

  const walkersRef = useRef<Walker[]>(initialWalkers.map((w) => ({ ...w })));
  const [walkers, setWalkers] = useState<Walker[]>(initialWalkers);

  useEffect(() => {
    let frameId = 0;
    let tick = 0;
    const rng = createMulberry32(19847);

    const step = () => {
      tick += 1;
      const mode = modeRef.current;
      const pts = walkersRef.current;

      for (let i = 0; i < pts.length; i += 1) {
        const w = pts[i];
        if (mode === 'gradient') {
          // Smooth convergence along isolines toward NEEDLE
          const angle = tick * 0.03 + i * 0.6;
          const r = 10 + (i % 4) * 5;
          const tx = NEEDLE.x + Math.cos(angle) * r;
          const ty = NEEDLE.y + Math.sin(angle) * r;
          w.vx = w.vx * 0.8 + (tx - w.x) * 0.05 + (rng() - 0.5) * 0.6;
          w.vy = w.vy * 0.8 + (ty - w.y) * 0.05 + (rng() - 0.5) * 0.6;
        } else {
          // Blind uniform random walk on flat plateau (no gradient signal)
          w.vx = w.vx * 0.72 + (rng() - 0.5) * 3.1;
          w.vy = w.vy * 0.72 + (rng() - 0.5) * 3.1;
        }

        w.x += w.vx;
        w.y += w.vy;
        if (w.x < 24 || w.x > 396) {
          w.x = Math.max(24, Math.min(396, w.x));
          w.vx *= -0.8;
        }
        if (w.y < 24 || w.y > 196) {
          w.y = Math.max(24, Math.min(196, w.y));
          w.vy *= -0.8;
        }
      }

      if (tick % 2 === 0) {
        setWalkers(pts.map((w) => ({ ...w })));
      }
      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Dinámica de Población sobre el Paisaje
          </span>
          <h3 className="text-base font-bold text-slate-100">
            {landscape === 'flat'
              ? 'Superficie Plana Sin Gradiente (Aguja en un Pajar)'
              : 'Superficie Escalable (Con Gradiente Implícito)'}
          </h3>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onLandscapeChange('gradient')}
            onKeyDown={(e) => e.stopPropagation()}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
              landscape === 'gradient'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Con Gradiente
          </button>
          <button
            type="button"
            onClick={() => onLandscapeChange('flat')}
            onKeyDown={(e) => e.stopPropagation()}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
              landscape === 'flat'
                ? 'border-rose-400 bg-rose-500/20 text-rose-100'
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Paisaje Plano
          </button>
        </div>
      </div>

      {/* 2D Contour + Needle SVG */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-[#050816] p-1">
        <svg viewBox="0 0 420 220" className="h-full w-full">
          {landscape === 'gradient' ? (
            <>
              {[135, 100, 68, 38, 16].map((r, idx) => (
                <circle
                  key={r}
                  cx={NEEDLE.x}
                  cy={NEEDLE.y}
                  r={r}
                  fill={`rgba(52,211,153,${0.04 + idx * 0.04})`}
                  stroke="rgba(52,211,153,0.35)"
                  strokeDasharray={idx % 2 === 0 ? '4 3' : undefined}
                />
              ))}
              <text x={NEEDLE.x} y="24" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="700">
                Isolíneas guían la selección hacia x*
              </text>
            </>
          ) : (
            <>
              <rect
                x="18"
                y="18"
                width="384"
                height="184"
                rx="10"
                fill="rgba(251,113,133,0.06)"
                stroke="rgba(251,113,133,0.28)"
              />
              <circle cx={NEEDLE.x} cy={NEEDLE.y} r="5.5" fill="#fb7185" stroke="#fff" strokeWidth="1.3" />
              <text x={NEEDLE.x} y={NEEDLE.y - 12} textAnchor="middle" fill="#fda4af" fontSize="10.5" fontWeight="700">
                Aguja x* (sin pista vecina)
              </text>
              <text x="120" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10.5">
                f(x) = constante → P(i) = 1/N
              </text>
            </>
          )}

          {/* Animated Population */}
          {walkers.map((w, idx) => (
            <circle
              key={idx}
              cx={w.x}
              cy={w.y}
              r="4.2"
              fill={landscape === 'gradient' ? '#22d3ee' : '#fbbf24'}
              stroke="#050816"
              strokeWidth="1"
              opacity="0.92"
            />
          ))}
        </svg>
      </div>

      {/* Cross-section profile bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/75 px-4 py-2.5 text-xs text-slate-300">
        {landscape === 'flat'
          ? 'Meseta plana: cada punto fuera de la aguja recibe idéntica evaluación f(x)=c; el muestreo colapsa a búsqueda aleatoria ciega.'
          : 'Superficie escalable: las isolíneas proveen correlación espacial aptitud-distancia y permiten convergencia progresiva.'}
      </div>
    </div>
  );
}
