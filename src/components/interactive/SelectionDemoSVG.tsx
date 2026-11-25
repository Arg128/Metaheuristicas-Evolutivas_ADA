import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { ParameterSlider } from '../ui/ParameterSlider';
import { createMulberry32 } from '../../utils/prng';

export interface SelectionCandidate {
  id: string;
  fitness: number;
  color: string;
}

export interface SelectionDemoSVGProps {
  candidates: SelectionCandidate[];
  tournamentK: number;
  onTournamentKChange: (k: number) => void;
  activeMethod: 'roulette' | 'tournament';
  onMethodChange: (method: 'roulette' | 'tournament') => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSector(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function SelectionDemoSVG({
  candidates,
  tournamentK,
  onTournamentKChange,
  activeMethod,
  onMethodChange,
}: SelectionDemoSVGProps) {
  const totalFitness = useMemo(
    () => candidates.reduce((acc, c) => acc + c.fitness, 0),
    [candidates],
  );

  const sectors = useMemo(() => {
    let currentAngle = 0;
    return candidates.map((c) => {
      const span = (c.fitness / totalFitness) * 360;
      const start = currentAngle;
      const end = currentAngle + span;
      currentAngle = end;
      return {
        ...c,
        start,
        end,
        mid: (start + end) / 2,
        prob: c.fitness / totalFitness,
      };
    });
  }, [candidates, totalFitness]);

  const rngRef = useRef(createMulberry32(84211));
  const [wheelAngle, setWheelAngle] = useState<number>(0);
  const [rouletteWinner, setRouletteWinner] = useState<string>('A');
  const [tourneyContenders, setTourneyContenders] = useState<string[]>(['A', 'C', 'D']);
  const [tourneyWinner, setTourneyWinner] = useState<string>('A');
  const [rouletteCounts, setRouletteCounts] = useState<Record<string, number>>({
    A: 5,
    B: 2,
    C: 2,
    D: 1,
    E: 0,
  });
  const [tourneyCounts, setTourneyCounts] = useState<Record<string, number>>({
    A: 6,
    B: 3,
    C: 1,
    D: 0,
    E: 0,
  });

  const sampleParent = () => {
    const rng = rngRef.current;

    // 1. Roulette sampling
    const r = rng() * totalFitness;
    let accum = 0;
    let pickedSector = sectors[0];
    for (const s of sectors) {
      accum += s.fitness;
      if (r <= accum) {
        pickedSector = s;
        break;
      }
    }

    // Rotate wheel so picked sector lands at top pointer (0 deg)
    const offsetWithinSector = (rng() - 0.5) * (pickedSector.end - pickedSector.start) * 0.65;
    const targetSectorAngle = pickedSector.mid + offsetWithinSector;
    const extraSpins = 360 * 2;
    setWheelAngle((prev) => prev + extraSpins + ((360 - (targetSectorAngle % 360) - (prev % 360) + 360) % 360));
    setRouletteWinner(pickedSector.id);
    setRouletteCounts((prev) => ({
      ...prev,
      [pickedSector.id]: (prev[pickedSector.id] ?? 0) + 1,
    }));

    // 2. Stochastic tournament of size k
    const chosen: SelectionCandidate[] = [];
    for (let i = 0; i < tournamentK; i += 1) {
      const idx = Math.floor(rng() * candidates.length);
      chosen.push(candidates[idx]);
    }
    const best = chosen.reduce((a, b) => (b.fitness > a.fitness ? b : a), chosen[0]);
    setTourneyContenders(chosen.map((c) => c.id));
    setTourneyWinner(best.id);
    setTourneyCounts((prev) => ({
      ...prev,
      [best.id]: (prev[best.id] ?? 0) + 1,
    }));
  };

  const resetCounts = () => {
    rngRef.current = createMulberry32(84211);
    setRouletteCounts({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setTourneyCounts({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  };

  const totalRouletteSamples = Object.values(rouletteCounts).reduce((a, b) => a + b, 0) || 1;
  const totalTourneySamples = Object.values(tourneyCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Simulador Dual en Vivo
          </span>
          <h3 className="text-base font-bold text-slate-100">
            Ruleta Proporcional vs. Torneo (k = {tournamentK})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sampleParent}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-100 hover:bg-violet-500/30 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" />
            Muestrear Padre
          </button>
          <button
            type="button"
            onClick={resetCounts}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 p-1.5 text-slate-300 hover:text-slate-100 cursor-pointer"
            aria-label="Reiniciar contadores"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dual SVG Arena: Roulette (left) + Tournament Bracket (right) */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-2.5">
        {/* Left: Roulette Wheel SVG */}
        <div
          onClick={() => onMethodChange('roulette')}
          className={`col-span-6 flex flex-col items-center justify-between rounded-xl border p-2.5 transition-colors cursor-pointer ${
            activeMethod === 'roulette'
              ? 'border-amber-400/70 bg-amber-500/8'
              : 'border-slate-800 bg-[#050816]'
          }`}
        >
          <div className="flex w-full items-center justify-between text-[11px]">
            <span className="font-semibold text-amber-200">Ruleta fᵢ / Σfⱼ</span>
            <span className="font-mono text-slate-300">Ganador: {rouletteWinner}</span>
          </div>

          <svg viewBox="0 0 180 164" className="w-full max-h-[148px]">
            {/* Pointer at top */}
            <polygon points="90,14 84,3 96,3" fill="#fbbf24" />
            <motion.g
              animate={{ rotate: wheelAngle }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: '90px', originY: '88px' }}
            >
              {sectors.map((s) => {
                const labelPos = polarToCartesian(90, 88, 44, s.mid);
                return (
                  <g key={s.id}>
                    <path
                      d={describeSector(90, 88, 68, s.start, s.end)}
                      fill={s.color}
                      fillOpacity={rouletteWinner === s.id ? 0.92 : 0.68}
                      stroke="#050816"
                      strokeWidth="2"
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 3}
                      textAnchor="middle"
                      fill="#050816"
                      fontSize="10"
                      fontWeight="800"
                    >
                      {s.id}
                    </text>
                  </g>
                );
              })}
              <circle cx="90" cy="88" r="14" fill="#050816" stroke="#e2e8f0" strokeWidth="1.5" />
            </motion.g>
          </svg>
        </div>

        {/* Right: Stochastic Tournament Bracket SVG */}
        <div
          onClick={() => onMethodChange('tournament')}
          className={`col-span-6 flex flex-col items-center justify-between rounded-xl border p-2.5 transition-colors cursor-pointer ${
            activeMethod === 'tournament'
              ? 'border-violet-400/70 bg-violet-500/8'
              : 'border-slate-800 bg-[#050816]'
          }`}
        >
          <div className="flex w-full items-center justify-between text-[11px]">
            <span className="font-semibold text-violet-200">Torneo k = {tournamentK}</span>
            <span className="font-mono text-slate-300">Ganador: {tourneyWinner}</span>
          </div>

          <svg viewBox="0 0 190 164" className="w-full max-h-[148px]">
            {tourneyContenders.slice(0, tournamentK).map((cid, idx) => {
              const cand = candidates.find((c) => c.id === cid) ?? candidates[0];
              const total = Math.max(1, Math.min(tournamentK, tourneyContenders.length));
              const y = 24 + (idx * 116) / Math.max(1, total - 1 || 1);
              const isWin = cid === tourneyWinner;
              return (
                <g key={`${cid}-${idx}`}>
                  <line
                    x1="68"
                    y1={total === 1 ? 82 : y}
                    x2="122"
                    y2="82"
                    stroke={isWin ? '#a78bfa' : '#334155'}
                    strokeWidth={isWin ? '2.2' : '1.3'}
                  />
                  <rect
                    x="12"
                    y={(total === 1 ? 82 : y) - 13}
                    width="58"
                    height="26"
                    rx="7"
                    fill={isWin ? 'rgba(167,139,250,0.24)' : '#0f172a'}
                    stroke={cand.color}
                    strokeWidth={isWin ? '2' : '1.2'}
                  />
                  <text
                    x="41"
                    y={(total === 1 ? 82 : y) + 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10.5"
                    fontWeight="700"
                  >
                    {cand.id} ({cand.fitness})
                  </text>
                </g>
              );
            })}

            {/* Winner Node */}
            <motion.g
              key={tourneyWinner + tourneyContenders.join('')}
              initial={{ scale: 0.86, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <rect
                x="122"
                y="64"
                width="58"
                height="36"
                rx="9"
                fill="rgba(167,139,250,0.28)"
                stroke="#a78bfa"
                strokeWidth="2"
              />
              <text x="151" y="79" textAnchor="middle" fill="#ddd6fe" fontSize="8.5" fontWeight="600">
                PADRE
              </text>
              <text x="151" y="93" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                {tourneyWinner}
              </text>
            </motion.g>
          </svg>
        </div>
      </div>

      {/* Empirical Selection Frequency Bars */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Conteo Empírico Acumulado (Ruleta vs. Torneo)</span>
          <span className="font-mono">
            Muestras: {Object.values(tourneyCounts).reduce((a, b) => a + b, 0)}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {candidates.map((c) => {
            const rPct = ((rouletteCounts[c.id] ?? 0) / totalRouletteSamples) * 100;
            const tPct = ((tourneyCounts[c.id] ?? 0) / totalTourneySamples) * 100;
            return (
              <div key={c.id} className="rounded-lg border border-slate-800/90 bg-slate-900/70 p-1.5">
                <div className="mb-1 flex items-center justify-between font-mono text-[10.5px]">
                  <span className="font-bold text-slate-100">{c.id}</span>
                  <span className="text-slate-400">f={c.fitness}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${rPct}%` }}
                    />
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-400 transition-all duration-300"
                      style={{ width: `${tPct}%` }}
                    />
                  </div>
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9.5px] text-slate-400">
                  <span className="text-amber-300">R:{rouletteCounts[c.id] ?? 0}</span>
                  <span className="text-violet-300">T:{tourneyCounts[c.id] ?? 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ParameterSlider
        label="Tamaño del Torneo"
        symbol="k"
        value={tournamentK}
        min={2}
        max={5}
        step={1}
        accent="violet"
        onChange={onTournamentKChange}
      />
    </div>
  );
}
