import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronDown, ChevronRight, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

export type TaxonomyBranch = 'trajectory' | 'swarm' | 'evolutionary';

export interface TaxonomyTreeSVGProps {
  activeBranch: TaxonomyBranch;
  onSelectBranch: (branch: TaxonomyBranch) => void;
}

const BRANCH_DESCRIPTIONS: Record<TaxonomyBranch, { title: string; detail: string }> = {
  trajectory: {
    title: 'Trayectoria Única',
    detail:
      'Simulated Annealing (SA) y Tabu Search (TS) perturban una sola solución vecina por iteración con bajo uso de memoria.',
  },
  swarm: {
    title: 'Inteligencia de Enjambre',
    detail:
      'ACO y PSO coordinan múltiples agentes mediante feromonas o velocidades compartidas sin operadores de recombinación genética.',
  },
  evolutionary: {
    title: 'Computación Evolutiva (5 Familias)',
    detail:
      'AG, EE, PE, PG y Evolución Diferencial (DE) evolucionan poblaciones completas mediante selección estocástica y variación dirigida.',
  },
};

export function TaxonomyTreeSVG({ activeBranch, onSelectBranch }: TaxonomyTreeSVGProps) {
  const [popExpanded, setPopExpanded] = useState<boolean>(true);
  const [zoomEvolutionary, setZoomEvolutionary] = useState<boolean>(false);

  // Smoothly interpolate viewBox at 60 FPS using Framer Motion MotionValue
  const zoomProgress = useMotionValue(0);
  const viewBox = useTransform(zoomProgress, (t) => {
    const x = t * 405;
    const y = t * 185;
    const w = 720 - t * 395;
    const h = 365 - t * 185;
    return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
  });

  useEffect(() => {
    const controls = animate(zoomProgress, zoomEvolutionary ? 1 : 0, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [zoomEvolutionary, zoomProgress]);

  const handleToggleZoom = () => {
    if (!zoomEvolutionary) {
      setPopExpanded(true);
      onSelectBranch('evolutionary');
    }
    setZoomEvolutionary((prev) => !prev);
  };

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2.5">
      {/* Header + Animated Zoom Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Árbol Taxonómico Interactivo
          </span>
          <h3 className="truncate text-lg font-bold text-slate-100">
            {zoomEvolutionary
              ? 'Zoom: 5 Familias de Computación Evolutiva (incl. DE)'
              : 'Metaheurísticas: Trayectoria vs. Poblacionales'}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (zoomEvolutionary) setZoomEvolutionary(false);
              setPopExpanded((p) => !p);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/85 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-200 cursor-pointer"
          >
            {popExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-cyan-300" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-cyan-300" />
            )}
            {popExpanded ? 'Colapsar Poblacionales' : 'Expandir Poblacionales'}
          </button>

          <button
            type="button"
            onClick={handleToggleZoom}
            onKeyDown={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              zoomEvolutionary
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.25)]'
                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'
            }`}
          >
            {zoomEvolutionary ? (
              <>
                <ZoomOut className="h-3.5 w-3.5" />
                Visión General
              </>
            ) : (
              <>
                <ZoomIn className="h-3.5 w-3.5" />
                Zoom en Computación Evolutiva
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animated SVG Taxonomy Tree */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800/90 bg-[#050816] p-1">
        <motion.svg viewBox={viewBox} className="h-full w-full">
          <defs>
            <linearGradient id="evoGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
              <stop offset="100%" stopColor="rgba(167,139,250,0.16)" />
            </linearGradient>
          </defs>

          {/* Root -> Level 1 connectors */}
          <path
            d="M 360 52 L 360 82 L 155 82 L 155 112"
            fill="none"
            stroke={activeBranch === 'trajectory' ? '#fbbf24' : '#475569'}
            strokeWidth={activeBranch === 'trajectory' ? '2.4' : '1.8'}
          />
          <path
            d="M 360 52 L 360 82 L 505 82 L 505 112"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.4"
          />

          {/* Root Node */}
          <g transform="translate(245, 12)">
            <rect
              width="230"
              height="40"
              rx="10"
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text x="115" y="25" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="700">
              METAHEURÍSTICAS
            </text>
          </g>

          {/* Trayectoria Única */}
          <g
            transform="translate(40, 112)"
            className="cursor-pointer"
            onClick={() => onSelectBranch('trajectory')}
          >
            <rect
              width="230"
              height="42"
              rx="10"
              fill={activeBranch === 'trajectory' ? 'rgba(251,191,36,0.18)' : '#0f172a'}
              stroke={activeBranch === 'trajectory' ? '#fbbf24' : '#475569'}
              strokeWidth="2"
            />
            <text x="115" y="26" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700">
              Trayectoria Única
            </text>
          </g>

          {/* Trayectoria Leaves */}
          <path d="M 155 154 L 155 182" fill="none" stroke="#475569" strokeWidth="1.6" />
          <g transform="translate(50, 182)" onClick={() => onSelectBranch('trajectory')} className="cursor-pointer">
            <rect width="210" height="72" rx="10" fill="#090d1f" stroke="#334155" strokeWidth="1.3" />
            <rect x="12" y="10" width="186" height="22" rx="6" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.35)" />
            <text x="105" y="25" textAnchor="middle" fill="#fef3c7" fontSize="11.5" fontWeight="600">
              Simulated Annealing (SA)
            </text>
            <rect x="12" y="39" width="186" height="22" rx="6" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.35)" />
            <text x="105" y="54" textAnchor="middle" fill="#fef3c7" fontSize="11.5" fontWeight="600">
              Tabu Search (TS)
            </text>
          </g>

          {/* Poblacionales (Clickable to Expand/Collapse) */}
          <g
            transform="translate(390, 112)"
            className="cursor-pointer"
            onClick={() => setPopExpanded((prev) => !prev)}
          >
            <rect
              width="230"
              height="42"
              rx="10"
              fill="rgba(34,211,238,0.16)"
              stroke="#22d3ee"
              strokeWidth="2"
            />
            <text x="104" y="26" textAnchor="middle" fill="#a5f3fc" fontSize="13" fontWeight="700">
              Poblacionales
            </text>
            <circle cx="198" cy="21" r="10" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="1.2" />
            <text x="198" y="25" textAnchor="middle" fill="#ecfeff" fontSize="12" fontWeight="800">
              {popExpanded ? '−' : '+'}
            </text>
          </g>

          {/* Collapsible Poblacionales Subtree */}
          <AnimatePresence>
            {popExpanded ? (
              <motion.g
                key="pop-subtree"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {/* Connectors Poblacionales -> Enjambre & Computación Evolutiva */}
                <path
                  d="M 505 154 L 505 178 L 365 178 L 365 202"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                />
                <path
                  d="M 505 154 L 505 178 L 575 178 L 575 202"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.2"
                />

                {/* Inteligencia de Enjambre */}
                <g
                  transform="translate(275, 202)"
                  className="cursor-pointer"
                  onClick={() => onSelectBranch('swarm')}
                >
                  <rect
                    width="180"
                    height="38"
                    rx="10"
                    fill={activeBranch === 'swarm' ? 'rgba(52,211,153,0.2)' : '#0f172a'}
                    stroke={activeBranch === 'swarm' ? '#34d399' : '#475569'}
                    strokeWidth="1.8"
                  />
                  <text x="90" y="24" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="700">
                    Inteligencia de Enjambre
                  </text>
                </g>

                <g
                  transform="translate(285, 254)"
                  className="cursor-pointer"
                  onClick={() => onSelectBranch('swarm')}
                >
                  <rect width="160" height="68" rx="10" fill="#090d1f" stroke="#334155" strokeWidth="1.3" />
                  <rect x="12" y="10" width="136" height="21" rx="6" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.35)" />
                  <text x="80" y="24" textAnchor="middle" fill="#d1fae5" fontSize="11.5" fontWeight="600">
                    ACO · Colonia Hormigas
                  </text>
                  <rect x="12" y="37" width="136" height="21" rx="6" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.35)" />
                  <text x="80" y="51" textAnchor="middle" fill="#d1fae5" fontSize="11.5" fontWeight="600">
                    PSO · Enjambre Partículas
                  </text>
                </g>

                {/* Computación Evolutiva */}
                <g
                  transform="translate(470, 202)"
                  className="cursor-pointer"
                  onClick={() => onSelectBranch('evolutionary')}
                >
                  <rect
                    width="220"
                    height="38"
                    rx="10"
                    fill={activeBranch === 'evolutionary' ? 'url(#evoGlow)' : '#0f172a'}
                    stroke={activeBranch === 'evolutionary' ? '#22d3ee' : '#475569'}
                    strokeWidth="2.2"
                  />
                  <text x="110" y="24" textAnchor="middle" fill="#67e8f9" fontSize="12.5" fontWeight="700">
                    Computación Evolutiva
                  </text>
                </g>

                {/* 5 Evolutionary Families */}
                <g
                  transform="translate(432, 252)"
                  className="cursor-pointer"
                  onClick={() => onSelectBranch('evolutionary')}
                >
                  <rect
                    width="274"
                    height="98"
                    rx="12"
                    fill="#090d1f"
                    stroke="#22d3ee"
                    strokeOpacity="0.65"
                    strokeWidth="1.6"
                  />
                  {[
                    { code: 'AG', name: 'Alg. Genéticos', x: 12, y: 10, w: 120, color: '#a78bfa' },
                    { code: 'EE', name: 'Est. Evolutivas', x: 142, y: 10, w: 120, color: '#22d3ee' },
                    { code: 'PE', name: 'Prog. Evolutiva', x: 12, y: 39, w: 120, color: '#fbbf24' },
                    { code: 'PG', name: 'Prog. Genética', x: 142, y: 39, w: 120, color: '#34d399' },
                    {
                      code: 'DE',
                      name: 'Evolución Diferencial (DE)',
                      x: 12,
                      y: 68,
                      w: 250,
                      color: '#fb7185',
                      highlight: true,
                    },
                  ].map((fam) => (
                    <g key={fam.code} transform={`translate(${fam.x}, ${fam.y})`}>
                      <rect
                        width={fam.w}
                        height="23"
                        rx="6"
                        fill={fam.highlight ? 'rgba(251,113,133,0.18)' : 'rgba(30,41,59,0.9)'}
                        stroke={fam.color}
                        strokeWidth={fam.highlight ? '1.5' : '1.1'}
                      />
                      <text
                        x={fam.w / 2}
                        y="15.5"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="10.8"
                        fontWeight="700"
                      >
                        {fam.highlight ? fam.name : `${fam.code} · ${fam.name}`}
                      </text>
                    </g>
                  ))}
                </g>
              </motion.g>
            ) : (
              <motion.g
                key="pop-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <rect
                  x="415"
                  y="178"
                  width="180"
                  height="34"
                  rx="8"
                  fill="rgba(15,23,42,0.9)"
                  stroke="#334155"
                  strokeDasharray="4 3"
                />
                <text x="505" y="199" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  Clic en «Poblacionales» para desplegar
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>
      </div>

      {/* Bottom Active Branch Info Bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300">{BRANCH_DESCRIPTIONS[activeBranch].title}:</strong>{' '}
          {BRANCH_DESCRIPTIONS[activeBranch].detail}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
          <Sparkles className="h-3 w-3" />
          Interactivo
        </span>
      </div>
    </div>
  );
}
