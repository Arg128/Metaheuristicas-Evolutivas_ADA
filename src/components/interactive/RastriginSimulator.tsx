import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FastForward, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { MathFormula } from '../ui/MathFormula';
import { ParameterSlider } from '../ui/ParameterSlider';
import { createMulberry32, rastrigin2D } from '../../utils/prng';
import { RastriginHeatmapCanvas } from './RastriginHeatmapCanvas';

interface Individual {
  id: number;
  x: number;
  y: number;
  fitness: number;
  evaluated: boolean;
  isElite?: boolean;
  discarded?: boolean;
}

interface TournamentFlash {
  contenders: { x: number; y: number }[];
  winner: { x: number; y: number };
}

interface CrossoverArc {
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  cx: number;
  cy: number;
}

interface MutationJump {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface HistoryPoint {
  gen: number;
  best: number;
  avg: number;
}

const PSEUDOCODE_12 = [
  '01: P ← InicializarPoblacion(N)',
  '02: EvaluarAptitud(P)',
  '03: g ← 0',
  '04: mientras g < g_max hacer',
  '05:   Padres ← SeleccionarPadres(P, k)',
  '06:   Hijos ← Cruce(Padres, p_c)',
  '07:   Hijos ← Mutacion(Hijos, p_m, σ)',
  '08:   EvaluarAptitud(Hijos)',
  '09:   Elite ← ConservarMejores(P, E)',
  '10:   P ← ReemplazoElitista(Elite, Hijos)',
  '11:   g ← g + 1',
  '12: retornar MejorIndividuo(P)',
];

const G_MAX = 40;
const DOMAIN = 5.12;

function clampDomain(v: number) {
  return Math.max(-DOMAIN, Math.min(DOMAIN, v));
}

function thermalColor(fitness: number, evaluated: boolean): string {
  if (!evaluated) return '#64748b';
  const norm = Math.min(1, Math.max(0, fitness / 45));
  if (norm < 0.25) {
    // Near global optimum: crisp deep sky/cyan
    return '#0284c7';
  }
  if (norm < 0.55) {
    // Intermediate: rich amber
    return '#d97706';
  }
  // High energy: vivid crimson
  return '#e11d48';
}

function toSvg(val: number): number {
  return 160 + (val / DOMAIN) * 145;
}

export function RastriginSimulator({ formulaTex, formulaLabel }: { formulaTex?: string; formulaLabel?: string }) {
  // Population size N resets population when changed
  const [popSize, setPopSize] = useState<number>(50);
  const [seedInput, setSeedInput] = useState<string>('202507');

  // Live parameters stored in refs so changing them updates active loop WITHOUT resetting
  const [pm, setPm] = useState<number>(0.05);
  const [pc, setPc] = useState<number>(0.8);
  const [elitismPct, setElitismPct] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(1);

  const pmRef = useRef(pm);
  pmRef.current = pm;
  const pcRef = useRef(pc);
  pcRef.current = pc;
  const elitismRef = useRef(elitismPct);
  elitismRef.current = elitismPct;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Simulation runtime state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<number>(1);
  const [generation, setGeneration] = useState<number>(0);
  const [evaluations, setEvaluations] = useState<number>(0);
  const [population, setPopulation] = useState<Individual[]>([]);
  const [offspring, setOffspring] = useState<Individual[]>([]);
  const [parents, setParents] = useState<Individual[]>([]);
  const [tournamentFlashes, setTournamentFlashes] = useState<TournamentFlash[]>([]);
  const [crossoverArcs, setCrossoverArcs] = useState<CrossoverArc[]>([]);
  const [mutationJumps, setMutationJumps] = useState<MutationJump[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  // Mutable simulation refs for deterministic, tear-free stepping
  const rngRef = useRef<() => number>(createMulberry32(202507));
  const simRef = useRef({
    line: 1,
    gen: 0,
    evals: 0,
    pop: [] as Individual[],
    parents: [] as Individual[],
    offspring: [] as Individual[],
    history: [] as HistoryPoint[],
    nextId: 1,
  });

  const gaussianRandom = (rng: () => number) => {
    const u1 = Math.max(1e-7, rng());
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const resetSimulation = useCallback(
    (newN = popSize, customSeedStr = seedInput) => {
      const parsedSeed = Number.parseInt(customSeedStr, 10);
      const safeSeed = Number.isFinite(parsedSeed) ? parsedSeed : 202507;
      const rng = createMulberry32(safeSeed + newN * 31);
      rngRef.current = rng;

      // L1: Initialize uniformly scattered gray individuals
      const initPop: Individual[] = Array.from({ length: newN }, (_, idx) => {
        const x = (rng() * 2 - 1) * DOMAIN;
        const y = (rng() * 2 - 1) * DOMAIN;
        return {
          id: idx + 1,
          x,
          y,
          fitness: rastrigin2D(x, y),
          evaluated: false,
        };
      });

      simRef.current = {
        line: 1,
        gen: 0,
        evals: 0,
        pop: initPop,
        parents: [],
        offspring: [],
        history: [],
        nextId: newN + 1,
      };

      setIsPlaying(false);
      setActiveLine(1);
      setGeneration(0);
      setEvaluations(0);
      setPopulation(initPop);
      setParents([]);
      setOffspring([]);
      setTournamentFlashes([]);
      setCrossoverArcs([]);
      setMutationJumps([]);
      setHistory([]);
    },
    [popSize, seedInput],
  );

  // Initialize on mount and whenever N changes
  useEffect(() => {
    resetSimulation(popSize, seedInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popSize]);

  // Execute one pseudocode line transition (1..12)
  const stepSingleLine = useCallback(() => {
    const s = simRef.current;
    const rng = rngRef.current;
    const n = s.pop.length;
    if (n === 0) return;

    const currentLine = s.line;

    if (currentLine === 1) {
      // Advance to L2: Evaluate initial population
      s.pop = s.pop.map((ind) => ({ ...ind, evaluated: true }));
      s.evals += n;
      s.line = 2;
      setPopulation([...s.pop]);
      setEvaluations(s.evals);
      setActiveLine(2);
      return;
    }

    if (currentLine === 2) {
      // Advance to L3: g <- 0 & record initial point
      s.gen = 0;
      const sorted = [...s.pop].sort((a, b) => a.fitness - b.fitness);
      const avg = sorted.reduce((acc, i) => acc + i.fitness, 0) / sorted.length;
      s.history = [{ gen: 0, best: sorted[0].fitness, avg }];
      s.line = 3;
      setGeneration(0);
      setHistory([...s.history]);
      setActiveLine(3);
      return;
    }

    if (currentLine === 3 || currentLine === 11) {
      // Check while loop condition at L4
      s.line = 4;
      setTournamentFlashes([]);
      setCrossoverArcs([]);
      setMutationJumps([]);
      setOffspring([]);
      setActiveLine(4);
      return;
    }

    if (currentLine === 4) {
      if (s.gen >= G_MAX) {
        // Exit loop to L12: return best individual
        s.line = 12;
        setIsPlaying(false);
        setActiveLine(12);
        return;
      }
      // Advance to L5: Tournament Selection (k=3)
      const flashes: TournamentFlash[] = [];
      const selectedParents: Individual[] = [];
      const k = 3;
      for (let i = 0; i < n; i += 1) {
        const contenders: Individual[] = [];
        for (let c = 0; c < k; c += 1) {
          contenders.push(s.pop[Math.floor(rng() * n)]);
        }
        const winner = contenders.reduce(
          (best, cur) => (cur.fitness < best.fitness ? cur : best),
          contenders[0],
        );
        selectedParents.push(winner);
        if (i < 5) {
          flashes.push({
            contenders: contenders.map((c) => ({ x: c.x, y: c.y })),
            winner: { x: winner.x, y: winner.y },
          });
        }
      }
      s.parents = selectedParents;
      s.line = 5;
      setParents(selectedParents);
      setTournamentFlashes(flashes);
      setActiveLine(5);
      return;
    }

    if (currentLine === 5) {
      // Advance to L6: Crossover
      const arcs: CrossoverArc[] = [];
      const children: Individual[] = [];
      const curPc = pcRef.current;
      for (let i = 0; i < n; i += 2) {
        const p1 = s.parents[i];
        const p2 = s.parents[(i + 1) % n];
        if (rng() < curPc) {
          const alpha = 0.25 + rng() * 0.5;
          const c1x = clampDomain(alpha * p1.x + (1 - alpha) * p2.x);
          const c1y = clampDomain(alpha * p1.y + (1 - alpha) * p2.y);
          const c2x = clampDomain((1 - alpha) * p1.x + alpha * p2.x);
          const c2y = clampDomain((1 - alpha) * p1.y + alpha * p2.y);
          children.push({
            id: s.nextId++,
            x: c1x,
            y: c1y,
            fitness: rastrigin2D(c1x, c1y),
            evaluated: false,
          });
          if (children.length < n) {
            children.push({
              id: s.nextId++,
              x: c2x,
              y: c2y,
              fitness: rastrigin2D(c2x, c2y),
              evaluated: false,
            });
          }
          if (arcs.length < 7) {
            arcs.push({ p1x: p1.x, p1y: p1.y, p2x: p2.x, p2y: p2.y, cx: c1x, cy: c1y });
          }
        } else {
          children.push({ ...p1, id: s.nextId++, evaluated: false });
          if (children.length < n) {
            children.push({ ...p2, id: s.nextId++, evaluated: false });
          }
        }
      }
      s.offspring = children;
      s.line = 6;
      setTournamentFlashes([]);
      setCrossoverArcs(arcs);
      setOffspring([...children]);
      setActiveLine(6);
      return;
    }

    if (currentLine === 6) {
      // Advance to L7: Gaussian Mutation
      const curPm = pmRef.current;
      const sigma = Math.max(0.12, 0.75 * (1 - s.gen / (G_MAX * 1.15)));
      const jumps: MutationJump[] = [];
      s.offspring = s.offspring.map((child) => {
        if (rng() < curPm || rng() < curPm) {
          const nx = clampDomain(child.x + gaussianRandom(rng) * sigma);
          const ny = clampDomain(child.y + gaussianRandom(rng) * sigma);
          if (jumps.length < 10) {
            jumps.push({ fromX: child.x, fromY: child.y, toX: nx, toY: ny });
          }
          return { ...child, x: nx, y: ny, fitness: rastrigin2D(nx, ny), evaluated: false };
        }
        return child;
      });
      s.line = 7;
      setCrossoverArcs([]);
      setMutationJumps(jumps);
      setOffspring([...s.offspring]);
      setActiveLine(7);
      return;
    }

    if (currentLine === 7) {
      // Advance to L8: Evaluate offspring
      s.offspring = s.offspring.map((c) => ({ ...c, evaluated: true }));
      s.evals += s.offspring.length;
      s.line = 8;
      setMutationJumps([]);
      setOffspring([...s.offspring]);
      setEvaluations(s.evals);
      setActiveLine(8);
      return;
    }

    if (currentLine === 8) {
      // Advance to L9: ConservarMejores (mark elite)
      const eliteCount = Math.max(
        elitismRef.current > 0 ? 1 : 0,
        Math.round((elitismRef.current / 100) * n),
      );
      const sortedPrev = [...s.pop].sort((a, b) => a.fitness - b.fitness);
      const eliteIds = new Set(sortedPrev.slice(0, eliteCount).map((e) => e.id));
      s.pop = s.pop.map((ind) => ({
        ...ind,
        isElite: eliteIds.has(ind.id),
        discarded: !eliteIds.has(ind.id),
      }));
      s.line = 9;
      setPopulation([...s.pop]);
      setActiveLine(9);
      return;
    }

    if (currentLine === 9) {
      // Advance to L10: ReemplazoElitista
      const eliteCount = Math.max(
        elitismRef.current > 0 ? 1 : 0,
        Math.round((elitismRef.current / 100) * n),
      );
      const sortedPrev = [...s.pop].sort((a, b) => a.fitness - b.fitness);
      const elites = sortedPrev.slice(0, eliteCount).map((e) => ({
        ...e,
        isElite: true,
        discarded: false,
      }));
      const sortedOffspring = [...s.offspring].sort((a, b) => a.fitness - b.fitness);
      const nextPop = [...elites, ...sortedOffspring.slice(0, Math.max(0, n - elites.length))];
      s.pop = nextPop;
      s.offspring = [];
      s.line = 10;
      setPopulation([...nextPop]);
      setOffspring([]);
      setActiveLine(10);
      return;
    }

    if (currentLine === 10) {
      // Advance to L11: g <- g + 1 and update chart
      s.gen += 1;
      const sorted = [...s.pop].sort((a, b) => a.fitness - b.fitness);
      const avg = sorted.reduce((acc, i) => acc + i.fitness, 0) / sorted.length;
      s.history = [...s.history, { gen: s.gen, best: sorted[0].fitness, avg }];
      s.line = 11;
      setGeneration(s.gen);
      setHistory([...s.history]);
      setActiveLine(11);
      return;
    }

    if (currentLine === 12) {
      // Already completed, reset to L1 if user steps again
      resetSimulation(popSize, seedInput);
    }
  }, [popSize, resetSimulation, seedInput]);

  // Step full generation (+1 Gen)
  const stepOneGeneration = useCallback(() => {
    const startGen = simRef.current.gen;
    if (startGen >= G_MAX) return;
    let guard = 0;
    while (simRef.current.gen === startGen && simRef.current.line !== 12 && guard < 15) {
      stepSingleLine();
      guard += 1;
    }
  }, [stepSingleLine]);

  // Play/Pause timer driven by speedRef
  useEffect(() => {
    if (!isPlaying) return;
    let timerId = 0;
    const tick = () => {
      stepSingleLine();
      if (simRef.current.line === 12) {
        setIsPlaying(false);
        return;
      }
      const delayMs = Math.max(35, Math.round(280 / speedRef.current));
      timerId = window.setTimeout(tick, delayMs);
    };
    const initialDelay = Math.max(35, Math.round(280 / speedRef.current));
    timerId = window.setTimeout(tick, initialDelay);
    return () => window.clearTimeout(timerId);
  }, [isPlaying, stepSingleLine]);

  const sortedPop = [...population].sort((a, b) => a.fitness - b.fitness);
  const bestInd = sortedPop[0];
  const avgFitness =
    sortedPop.length > 0
      ? sortedPop.reduce((acc, i) => acc + i.fitness, 0) / sortedPop.length
      : 0;

  const isLoopPulse = activeLine === 4 || activeLine === 11;

  // Convergence SVG chart paths
  const maxHistFit = Math.max(35, ...history.map((h) => h.avg));
  const chartX = (g: number) => 28 + (g / G_MAX) * 204;
  const chartY = (f: number) => 76 - Math.min(1, f / maxHistFit) * 62;
  const bestPath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${chartX(h.gen).toFixed(1)} ${chartY(h.best).toFixed(1)}`)
    .join(' ');
  const avgPath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${chartX(h.gen).toFixed(1)} ${chartY(h.avg).toFixed(1)}`)
    .join(' ');

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-4">
      {/* Left 5 Cols: 12-Line Pseudocode Debugger + Live Sliders + Formula */}
      <div className="col-span-5 flex min-h-0 flex-col justify-between gap-2">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Depurador 12 Líneas · Gen {generation}/{G_MAX}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                onKeyDown={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold shadow-xs cursor-pointer ${
                  isPlaying
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isPlaying ? 'Pausa' : 'Play'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  stepSingleLine();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-800 hover:bg-cyan-100 cursor-pointer"
              >
                <StepForward className="h-3 w-3" />
                Paso
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  stepOneGeneration();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-800 hover:bg-violet-100 cursor-pointer"
              >
                <FastForward className="h-3 w-3" />
                +1 Gen
              </button>
              <button
                type="button"
                onClick={() => resetSimulation(popSize, seedInput)}
                onKeyDown={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                aria-label="Reiniciar simulador"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="space-y-0.5 font-mono text-[11.5px] leading-tight">
            {PSEUDOCODE_12.map((text, idx) => {
              const lineNum = idx + 1;
              const isCurrent = lineNum === activeLine;
              return (
                <div
                  key={lineNum}
                  className={`rounded px-2 py-[3px] transition-colors ${
                    isCurrent
                      ? 'border border-emerald-400 bg-emerald-50 font-bold text-emerald-900 shadow-xs'
                      : 'border border-transparent text-slate-600'
                  }`}
                >
                  {text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Parameter Sliders */}
        <div className="grid grid-cols-2 gap-1.5">
          <ParameterSlider
            label="Población"
            symbol="N"
            value={popSize}
            min={10}
            max={200}
            step={5}
            accent="emerald"
            onChange={setPopSize}
          />
          <ParameterSlider
            label="Mutación"
            symbol="p_m"
            value={pm}
            min={0.001}
            max={0.3}
            step={0.005}
            accent="violet"
            formatValue={(v) => v.toFixed(3)}
            onChange={setPm}
          />
          <ParameterSlider
            label="Cruce"
            symbol="p_c"
            value={pc}
            min={0.1}
            max={1.0}
            step={0.05}
            accent="cyan"
            formatValue={(v) => v.toFixed(2)}
            onChange={setPc}
          />
          <ParameterSlider
            label="Elitismo"
            symbol="E"
            value={elitismPct}
            min={0}
            max={20}
            step={1}
            unit="%"
            accent="amber"
            onChange={setElitismPct}
          />
        </div>

        {formulaTex ? (
          <MathFormula
            tex={formulaTex}
            label={formulaLabel}
            block
            highlight
            accent="emerald"
            className="!px-3.5 !py-2"
          />
        ) : null}
      </div>

      {/* Right 7 Cols: Rastrigin 2D Heatmap Canvas + SVG Overlay + Telemetry + Convergence Chart */}
      <div className="col-span-7 flex min-h-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Rastrigin 2D [-5.12, 5.12]² · Mulberry32 Determinista
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Línea {String(activeLine).padStart(2, '0')} Activa · Mejor f ={' '}
              <span className="font-mono text-amber-700">
                {bestInd ? bestInd.fitness.toFixed(4) : '0.0000'}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700">
              <span className="font-semibold text-cyan-700">Seed:</span>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setSeedInput(val);
                }}
                onBlur={() => resetSimulation(popSize, seedInput)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') resetSimulation(popSize, seedInput);
                }}
                className="w-16 bg-transparent font-mono font-bold text-slate-900 focus:outline-none"
                aria-label="Semilla Mulberry32"
              />
            </label>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700">
              Evals: {evaluations}
            </span>
          </div>
        </div>

        <div className="my-2 grid min-h-0 flex-1 grid-cols-12 gap-3">
          {/* Canvas + SVG Overlay Container */}
          <div className="col-span-7 flex items-center justify-center">
            <motion.div
              animate={
                isLoopPulse
                  ? { boxShadow: ['0 0 0px rgba(5,150,105,0)', '0 0 18px rgba(5,150,105,0.35)', '0 0 0px rgba(5,150,105,0)'] }
                  : { boxShadow: '0 0 0px rgba(0,0,0,0)' }
              }
              transition={{ duration: 0.7 }}
              className="relative aspect-square h-full max-h-[380px] w-full max-w-[380px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner"
            >
              {/* Static 2D Heatmap Canvas */}
              <RastriginHeatmapCanvas
                size={320}
                className="absolute inset-0 h-full w-full"
              />

              {/* 60 FPS SVG Overlay */}
              <svg viewBox="0 0 320 320" className="relative z-10 h-full w-full">
                {/* Axes & Global Optimum Crosshair */}
                <line x1="15" y1="160" x2="305" y2="160" stroke="rgba(15,23,42,0.22)" strokeWidth="1" />
                <line x1="160" y1="15" x2="160" y2="305" stroke="rgba(15,23,42,0.22)" strokeWidth="1" />
                <circle cx="160" cy="160" r="10" fill="none" stroke="#047857" strokeWidth="1.4" strokeDasharray="3 2" />
                <circle cx="160" cy="160" r="3" fill="#059669" />

                {/* L5: Tournament flash lines */}
                {activeLine === 5 &&
                  tournamentFlashes.map((tf, i) => (
                    <g key={`tf-${i}`}>
                      {tf.contenders.map((c, j) => (
                        <line
                          key={j}
                          x1={toSvg(c.x)}
                          y1={toSvg(c.y)}
                          x2={toSvg(tf.winner.x)}
                          y2={toSvg(tf.winner.y)}
                          stroke="#b45309"
                          strokeWidth="1.5"
                          strokeOpacity="0.9"
                        />
                      ))}
                      <circle
                        cx={toSvg(tf.winner.x)}
                        cy={toSvg(tf.winner.y)}
                        r="8"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                    </g>
                  ))}

                {/* L6: Crossover parent interpolation trajectories */}
                {activeLine === 6 &&
                  crossoverArcs.map((arc, i) => (
                    <g key={`arc-${i}`}>
                      <line
                        x1={toSvg(arc.p1x)}
                        y1={toSvg(arc.p1y)}
                        x2={toSvg(arc.p2x)}
                        y2={toSvg(arc.p2y)}
                        stroke="#0e7490"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        opacity="0.85"
                      />
                      <circle cx={toSvg(arc.cx)} cy={toSvg(arc.cy)} r="4" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  ))}

                {/* L7: Mutation stochastic jump vectors */}
                {activeLine === 7 &&
                  mutationJumps.map((jmp, i) => (
                    <g key={`jmp-${i}`}>
                      <line
                        x1={toSvg(jmp.fromX)}
                        y1={toSvg(jmp.fromY)}
                        x2={toSvg(jmp.toX)}
                        y2={toSvg(jmp.toY)}
                        stroke="#7c3aed"
                        strokeWidth="2"
                      />
                      <circle
                        cx={toSvg(jmp.toX)}
                        cy={toSvg(jmp.toY)}
                        r="8"
                        fill="rgba(124,58,237,0.18)"
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                      />
                    </g>
                  ))}

                {/* Population individuals */}
                {population.map((ind) => {
                  const cx = toSvg(ind.x);
                  const cy = toSvg(ind.y);
                  const isBest = bestInd && ind.id === bestInd.id;
                  const fill = thermalColor(ind.fitness, ind.evaluated);
                  return (
                    <g key={ind.id} opacity={ind.discarded ? 0.25 : 0.96}>
                      {(isBest && ind.evaluated) || ind.isElite ? (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={activeLine === 12 && isBest ? 14 : 9}
                          fill="none"
                          stroke="#b45309"
                          strokeWidth={activeLine === 12 && isBest ? 2.6 : 1.8}
                        />
                      ) : null}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isBest ? 5 : 3.6}
                        fill={isBest && ind.evaluated ? '#f59e0b' : fill}
                        stroke={isBest && ind.evaluated ? '#0f172a' : '#ffffff'}
                        strokeWidth="1.1"
                      />
                    </g>
                  );
                })}

                {/* Offspring preview during L6..L8 */}
                {offspring.map((child) => (
                  <circle
                    key={`off-${child.id}`}
                    cx={toSvg(child.x)}
                    cy={toSvg(child.y)}
                    r="3.4"
                    fill={child.evaluated ? thermalColor(child.fitness, true) : '#0891b2'}
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.92"
                  />
                ))}

                {/* L5 Highlight parent rings */}
                {activeLine === 5 &&
                  parents.slice(0, 8).map((p, idx) => (
                    <circle
                      key={`par-${idx}`}
                      cx={toSvg(p.x)}
                      cy={toSvg(p.y)}
                      r="5.8"
                      fill="none"
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />
                  ))}
              </svg>
            </motion.div>
          </div>

          {/* Right Side Telemetry + Speed + Convergence SVG Chart */}
          <div className="col-span-5 flex flex-col justify-between gap-2">
            <ParameterSlider
              label="Velocidad"
              value={speed}
              min={0.5}
              max={5}
              step={0.5}
              unit="x"
              accent="cyan"
              formatValue={(v) => v.toFixed(1)}
              onChange={setSpeed}
            />

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <span className="text-slate-600">Óptimo Hallado</span>
                <p className="mt-0.5 font-mono font-bold text-amber-700">
                  ({bestInd ? bestInd.x.toFixed(2) : '0.00'}, {bestInd ? bestInd.y.toFixed(2) : '0.00'})
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <span className="text-slate-600">Promedio f(x,y)</span>
                <p className="mt-0.5 font-mono font-bold text-cyan-700">
                  {avgFitness.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Live Convergence SVG Chart */}
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-semibold text-emerald-700">Curva de Convergencia</span>
                <span className="font-mono text-slate-600">
                  <span className="font-semibold text-amber-700">● Mejor</span> ·{' '}
                  <span className="font-semibold text-cyan-700">● Prom</span>
                </span>
              </div>

              <svg viewBox="0 0 242 90" className="w-full flex-1">
                <line x1="28" y1="12" x2="28" y2="76" stroke="#64748b" strokeWidth="1" />
                <line x1="28" y1="76" x2="232" y2="76" stroke="#64748b" strokeWidth="1" />
                {avgPath ? (
                  <path d={avgPath} fill="none" stroke="#0891b2" strokeWidth="1.8" opacity="0.9" />
                ) : null}
                {bestPath ? (
                  <path d={bestPath} fill="none" stroke="#d97706" strokeWidth="2.4" />
                ) : null}
                <text x="130" y="87" textAnchor="middle" fill="#475569" fontSize="8.5" fontWeight="600">
                  Generación 0 → {G_MAX}
                </text>
              </svg>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700">
              {activeLine === 1 && 'L1: Población inicial dispersa en gris uniforme.'}
              {(activeLine === 2 || activeLine === 8) &&
                'Evaluación térmica: azul frío (bajo error) → oro/rojo (alto error).'}
              {activeLine === 3 && 'L3: Contador generacional g = 0 reiniciado.'}
              {(activeLine === 4 || activeLine === 11) &&
                'Bucle activo: verificando condición de parada g < g_max.'}
              {activeLine === 5 && 'L5: Destellos amarillos de torneo k = 3.'}
              {activeLine === 6 && 'L6: Trayectorias de interpolación entre parejas.'}
              {activeLine === 7 && 'L7: Saltos gaussianos violetas evitan óptimos locales.'}
              {(activeLine === 9 || activeLine === 10) &&
                'L9–10: Conservación de élite (halo dorado) y reemplazo.'}
              {activeLine === 12 &&
                'L12: Convergencia completada. Mejor individuo aislado.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
