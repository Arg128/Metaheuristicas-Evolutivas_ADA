import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Grid3x3, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useSlideKeyboard } from '../../hooks/useSlideKeyboard';
import { MathFormula } from '../ui/MathFormula';
import { createMulberry32, rastrigin2D } from '../../utils/prng';
import { RastriginHeatmapCanvas } from './RastriginHeatmapCanvas';

type ResolutionOption = 40 | 80 | 160;
const RESOLUTIONS: ResolutionOption[] = [40, 80, 160];

interface GAInd {
  x: number;
  y: number;
  fitness: number;
}

const DOMAIN = 5.12;
const GA_POP_SIZE = 32;
const GA_MAX_GENS = 45;

function clampD(v: number) {
  return Math.max(-DOMAIN, Math.min(DOMAIN, v));
}

function toSvg(val: number) {
  return 10 + ((val + DOMAIN) / (2 * DOMAIN)) * 240;
}

export function ExactVsGeneticRace({
  formulaTex,
  formulaLabel,
}: {
  formulaTex?: string;
  formulaLabel?: string;
}) {
  const [resolution, setResolution] = useState<ResolutionOption>(80);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [gridEvals, setGridEvals] = useState<number>(0);
  const [gridBest, setGridBest] = useState<{ x: number; y: number; f: number }>({
    x: -5.12,
    y: -5.12,
    f: rastrigin2D(-5.12, -5.12),
  });

  const [gaEvals, setGaEvals] = useState<number>(0);
  const [gaGen, setGaGen] = useState<number>(0);
  const [gaPop, setGaPop] = useState<GAInd[]>([]);
  const [gaBest, setGaBest] = useState<GAInd>({ x: 0, y: 0, fitness: 99 });

  const totalCells = resolution * resolution;

  const raceRef = useRef({
    gridIdx: 0,
    gridBest: { x: -5.12, y: -5.12, f: rastrigin2D(-5.12, -5.12) },
    gaPop: [] as GAInd[],
    gaGen: 0,
    gaEvals: 0,
    gaBest: { x: 0, y: 0, fitness: 99 } as GAInd,
    rng: createMulberry32(314159),
    tickCount: 0,
  });

  const resetRace = useCallback((res: ResolutionOption = resolution) => {
    const rng = createMulberry32(314159 + res);
    const initPop: GAInd[] = Array.from({ length: GA_POP_SIZE }, () => {
      const x = (rng() * 2 - 1) * DOMAIN;
      const y = (rng() * 2 - 1) * DOMAIN;
      return { x, y, fitness: rastrigin2D(x, y) };
    }).sort((a, b) => a.fitness - b.fitness);

    const firstGridBest = {
      x: -DOMAIN,
      y: -DOMAIN,
      f: rastrigin2D(-DOMAIN, -DOMAIN),
    };

    raceRef.current = {
      gridIdx: 0,
      gridBest: firstGridBest,
      gaPop: initPop,
      gaGen: 0,
      gaEvals: GA_POP_SIZE,
      gaBest: initPop[0],
      rng,
      tickCount: 0,
    };

    setIsPlaying(false);
    setGridEvals(0);
    setGridBest(firstGridBest);
    setGaPop(initPop);
    setGaGen(0);
    setGaEvals(GA_POP_SIZE);
    setGaBest(initPop[0]);
  }, [resolution]);

  useEffect(() => {
    resetRace(resolution);
  }, [resolution, resetRace]);

  useSlideKeyboard({
    onNextState: () =>
      setResolution((prev) => RESOLUTIONS[(RESOLUTIONS.indexOf(prev) + 1) % RESOLUTIONS.length]),
    onPrevState: () =>
      setResolution(
        (prev) =>
          RESOLUTIONS[(RESOLUTIONS.indexOf(prev) - 1 + RESOLUTIONS.length) % RESOLUTIONS.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < RESOLUTIONS.length) setResolution(RESOLUTIONS[idx]);
    },
    onAction: () => {
      if (gridEvals >= totalCells && gaGen >= GA_MAX_GENS) {
        resetRace(resolution);
      }
      setIsPlaying((p) => !p);
    },
    onKey: (k) => {
      if (k === 'r') resetRace(resolution);
    },
  });

  useEffect(() => {
    if (!isPlaying) return;
    let frameId = 0;

    const stepFrame = () => {
      const s = raceRef.current;
      s.tickCount += 1;

      // Advance Grid Search proportional to resolution (~4 seconds to finish 40x40, ~7s for 80x80, ~12s for 160x160)
      const cellsPerFrame = resolution === 40 ? 12 : resolution === 80 ? 28 : 72;
      if (s.gridIdx < totalCells) {
        const end = Math.min(totalCells, s.gridIdx + cellsPerFrame);
        const stepSize = (2 * DOMAIN) / (resolution - 1);
        for (let idx = s.gridIdx; idx < end; idx += 1) {
          const row = Math.floor(idx / resolution);
          const col = idx % resolution;
          const x = -DOMAIN + col * stepSize;
          const y = -DOMAIN + row * stepSize;
          const f = rastrigin2D(x, y);
          if (f < s.gridBest.f) {
            s.gridBest = { x, y, f };
          }
        }
        s.gridIdx = end;
      }

      // Advance GA 1 generation every 4 frames until GA_MAX_GENS
      if (s.tickCount % 4 === 0 && s.gaGen < GA_MAX_GENS) {
        const rng = s.rng;
        const n = s.gaPop.length;
        const nextGen: GAInd[] = [s.gaPop[0], s.gaPop[1]]; // 2 elites
        const sigma = Math.max(0.08, 0.72 * (1 - s.gaGen / (GA_MAX_GENS * 1.1)));

        const gauss = () => {
          const u1 = Math.max(1e-7, rng());
          const u2 = rng();
          return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        };

        const pickParent = () => {
          let best = s.gaPop[Math.floor(rng() * n)];
          for (let k = 1; k < 3; k += 1) {
            const cand = s.gaPop[Math.floor(rng() * n)];
            if (cand.fitness < best.fitness) best = cand;
          }
          return best;
        };

        while (nextGen.length < n) {
          const p1 = pickParent();
          const p2 = pickParent();
          const alpha = rng();
          let cx = rng() < 0.85 ? alpha * p1.x + (1 - alpha) * p2.x : p1.x;
          let cy = rng() < 0.85 ? alpha * p1.y + (1 - alpha) * p2.y : p1.y;
          if (rng() < 0.25) {
            cx = clampD(cx + gauss() * sigma);
            cy = clampD(cy + gauss() * sigma);
          }
          cx = clampD(cx);
          cy = clampD(cy);
          nextGen.push({ x: cx, y: cy, fitness: rastrigin2D(cx, cy) });
        }

        nextGen.sort((a, b) => a.fitness - b.fitness);
        s.gaPop = nextGen;
        s.gaGen += 1;
        s.gaEvals += n - 2;
        if (nextGen[0].fitness < s.gaBest.fitness) {
          s.gaBest = nextGen[0];
        }
      }

      setGridEvals(s.gridIdx);
      setGridBest(s.gridBest);
      setGaPop([...s.gaPop]);
      setGaGen(s.gaGen);
      setGaEvals(s.gaEvals);
      setGaBest(s.gaBest);

      if (s.gridIdx >= totalCells && s.gaGen >= GA_MAX_GENS) {
        setIsPlaying(false);
        return;
      }

      frameId = window.requestAnimationFrame(stepFrame);
    };

    frameId = window.requestAnimationFrame(stepFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPlaying, resolution, totalCells]);

  // Compute grid sweep geometry for SVG overlay
  const completedRows = Math.floor(gridEvals / resolution);
  const partialCols = gridEvals % resolution;
  const rowHeightSvg = 240 / resolution;
  const partialWidthSvg = (partialCols / resolution) * 240;
  const cursorX = 10 + partialWidthSvg;
  const cursorY = 10 + completedRows * rowHeightSvg;

  const savingsFactor = gaEvals > 0 ? totalCells / gaEvals : 1;

  // Exponential growth projection in D=2, 4, 8
  const projections = useMemo(() => {
    const formatBig = (val: number) =>
      val < 1e6 ? val.toLocaleString('es-PE') : val.toExponential(2).replace('e+', '×10^');
    return [
      { d: 2, count: formatBig(Math.pow(resolution, 2)) },
      { d: 4, count: formatBig(Math.pow(resolution, 4)) },
      { d: 8, count: formatBig(Math.pow(resolution, 8)) },
    ];
  }, [resolution]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Split Synchronized Arena */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-4">
        {/* Left 6 Cols: Exhaustive Grid Search */}
        <div className="col-span-6 flex min-h-0 flex-col justify-between rounded-2xl border border-rose-200 bg-white/95 p-3.5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5 text-rose-700" />
              <div>
                <h3 className="text-lg font-bold text-black">
                  Búsqueda Exacta (Grilla {resolution}×{resolution})
                </h3>
                <p className="text-sm font-medium text-[#1B365D]">
                  Barrido exhaustivo sin memoria previa
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-sm">
              <span className="block font-bold text-rose-700">
                {gridEvals.toLocaleString('es-PE')} / {totalCells.toLocaleString('es-PE')} evals
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Mejor f = {gridBest.f.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="my-1.5 flex min-h-0 flex-1 items-center justify-center">
            <div className="relative aspect-square h-full max-h-[270px] w-full max-w-[270px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner">
              <RastriginHeatmapCanvas size={260} className="absolute inset-0 h-full w-full" />
              <svg viewBox="0 0 260 260" className="relative z-10 h-full w-full">
                {/* Completed rows sweep overlay */}
                {completedRows > 0 ? (
                  <rect
                    x="10"
                    y="10"
                    width="240"
                    height={completedRows * rowHeightSvg}
                    fill="rgba(225,29,72,0.22)"
                  />
                ) : null}
                {/* Partial row */}
                {partialCols > 0 ? (
                  <rect
                    x="10"
                    y={10 + completedRows * rowHeightSvg}
                    width={partialWidthSvg}
                    height={Math.max(1.5, rowHeightSvg)}
                    fill="rgba(225,29,72,0.36)"
                  />
                ) : null}

                {/* Target (0,0) */}
                <circle cx="130" cy="130" r="6" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* Current sweep cursor */}
                {gridEvals < totalCells ? (
                  <g>
                    <line x1="10" y1={cursorY} x2="250" y2={cursorY} stroke="#e11d48" strokeWidth="1.2" opacity="0.7" />
                    <circle cx={cursorX} cy={cursorY} r="4" fill="#e11d48" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                ) : null}

                {/* Best found by grid */}
                <circle
                  cx={toSvg(gridBest.x)}
                  cy={toSvg(gridBest.y)}
                  r="5.5"
                  fill="#f59e0b"
                  stroke="#0f172a"
                  strokeWidth="1.4"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm">
            <span className="font-medium text-slate-700">Progreso de malla:</span>
            <span className="font-mono font-bold text-rose-700">
              {((gridEvals / totalCells) * 100).toFixed(1)}% cubierto
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Genetic Algorithm */}
        <div className="col-span-6 flex min-h-0 flex-col justify-between rounded-2xl border border-emerald-200 bg-white/95 p-3.5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-700" />
              <div>
                <h3 className="text-lg font-bold text-black">
                  Algoritmo Genético (N = {GA_POP_SIZE} · Gen {gaGen}/{GA_MAX_GENS})
                </h3>
                <p className="text-sm font-medium text-[#1B365D]">
                  Concentra muestras hacia el óptimo (0, 0)
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-sm">
              <span className="block font-bold text-emerald-700">
                {gaEvals.toLocaleString('es-PE')} evals
              </span>
              <span className="text-xs font-bold text-amber-700">
                Mejor f = {gaBest.fitness.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="my-1.5 flex min-h-0 flex-1 items-center justify-center">
            <div className="relative aspect-square h-full max-h-[270px] w-full max-w-[270px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner">
              <RastriginHeatmapCanvas size={260} className="absolute inset-0 h-full w-full" />
              <svg viewBox="0 0 260 260" className="relative z-10 h-full w-full">
                <line x1="10" y1="130" x2="250" y2="130" stroke="rgba(15,23,42,0.22)" />
                <line x1="130" y1="10" x2="130" y2="250" stroke="rgba(15,23,42,0.22)" />
                <circle cx="130" cy="130" r="8" fill="none" stroke="#059669" strokeWidth="1.6" strokeDasharray="3 2" />

                {gaPop.map((ind, idx) => (
                  <circle
                    key={idx}
                    cx={toSvg(ind.x)}
                    cy={toSvg(ind.y)}
                    r={idx === 0 ? 5.4 : 3.6}
                    fill={idx === 0 ? '#f59e0b' : '#0284c7'}
                    stroke={idx === 0 ? '#0f172a' : '#ffffff'}
                    strokeWidth="1.2"
                  />
                ))}
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm">
            <span className="font-medium text-slate-700">Ahorro vs. malla completa:</span>
            <span className="font-mono font-bold text-emerald-700">
              {savingsFactor.toFixed(1)}× menos evaluaciones
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Control & Dimensionality Bar */}
      <div className="grid shrink-0 grid-cols-12 items-center gap-3">
        {/* Resolution Selector */}
        <div className="col-span-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm shadow-slate-900/5">
          <span className="text-sm font-bold text-slate-800">Grilla:</span>
          <div className="flex gap-1.5">
            {([40, 80, 160] as ResolutionOption[]).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                onKeyDown={(e) => e.stopPropagation()}
                className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold cursor-pointer ${
                  resolution === res
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {res}×{res}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensionality Projection Callout */}
        <div className="col-span-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm shadow-slate-900/5">
          {projections.map((p) => (
            <div key={p.d} className="text-center">
              <span className="block font-mono font-semibold text-slate-500">D = {p.d}</span>
              <span className="font-mono text-sm font-bold text-rose-700">{p.count}</span>
            </div>
          ))}
        </div>

        {/* Play/Pause/Reset + Formula */}
        <div className="col-span-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (gridEvals >= totalCells && gaGen >= GA_MAX_GENS) {
                resetRace(resolution);
              }
              setIsPlaying((p) => !p);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold shadow-xs cursor-pointer ${
              isPlaying
                ? 'border-amber-500 bg-amber-50 text-amber-800'
                : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? 'Pausa' : 'Iniciar'}
          </button>

          <button
            type="button"
            onClick={() => resetRace(resolution)}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            aria-label="Reiniciar carrera"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {formulaTex ? (
            <div className="min-w-0 flex-1">
              <MathFormula
                tex={formulaTex}
                label={formulaLabel}
                block
                highlight
                accent="emerald"
                className="!px-2.5 !py-1.5 text-xs"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
