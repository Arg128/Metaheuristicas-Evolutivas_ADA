import { useState } from 'react';
import { Car, Dna, Radio, Zap } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SemanticAccent, SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

type CaseId = 'nasa' | 'auto' | 'bio' | 'grid';

interface RealCase {
  id: CaseId;
  title: string;
  domain: string;
  accent: SemanticAccent;
  genotype: string;
  impact: string;
  icon: typeof Radio;
}

const CASES: RealCase[] = [
  {
    id: 'nasa',
    title: 'Aeroespacial (NASA ST5)',
    domain: 'Antena Espacial Evolucionada',
    accent: 'cyan',
    genotype: 'Árbol constructivo de segmentos y ángulos 3D',
    impact: 'Geometría asimétrica con mayor ganancia hemisférica y menor masa que diseños humanos.',
    icon: Radio,
  },
  {
    id: 'auto',
    title: 'Automotriz (Multiobjetivo)',
    domain: 'Chasis y Absorción de Impacto',
    accent: 'rose',
    genotype: 'Vector real de espesores y aleaciones estructurales',
    impact: 'Frente de Pareto óptimo entre absorción de energía de choque y reducción de masa.',
    icon: Car,
  },
  {
    id: 'bio',
    title: 'Bioinformática y Medicina',
    domain: 'Plegamiento y Alineamiento',
    accent: 'emerald',
    genotype: 'Secuencias discretas y ángulos diedros combinatorios',
    impact: 'Explora paisajes conformacionales masivos no derivables para descubrimiento de fármacos.',
    icon: Dna,
  },
  {
    id: 'grid',
    title: 'Sistemas Eléctricos y Control',
    domain: 'Control Híbrido PID + Difuso',
    accent: 'amber',
    genotype: 'Cromosoma heterogéneo: reales (Kp, Ki, Kd) + reglas discretas',
    impact: 'Co-optimiza estabilidad transitoria y despacho económico en microrredes.',
    icon: Zap,
  },
];

const PARETO_POINTS = [
  { mass: 210, energy: 92, nonDominated: true, label: 'P1' },
  { mass: 235, energy: 108, nonDominated: true, label: 'P2' },
  { mass: 262, energy: 121, nonDominated: true, label: 'P3' },
  { mass: 295, energy: 132, nonDominated: true, label: 'P4' },
  { mass: 255, energy: 95, nonDominated: false, label: '' },
  { mass: 285, energy: 104, nonDominated: false, label: '' },
  { mass: 310, energy: 112, nonDominated: false, label: '' },
];

export function Slide18RealWorldCases({ meta, totalSlides }: SlideProps) {
  const [selected, setSelected] = useState<CaseId>('nasa');
  const activeCase = CASES.find((c) => c.id === selected) ?? CASES[0];

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="En ingeniería real, los algoritmos evolutivos destacan en geometrías no intuitivas, compromisos multiobjetivo (Frente de Pareto) y cromosomas mixtos."
    >
      {/* Top 4-Case Selector Row */}
      <div className="grid grid-cols-4 gap-3">
        {CASES.map((item) => {
          const Icon = item.icon;
          return (
            <InteractiveCard
              key={item.id}
              title={item.title}
              subtitle={item.domain}
              icon={<Icon className="h-5 w-5" />}
              accent={item.accent}
              active={selected === item.id}
              onClick={() => setSelected(item.id)}
              className="!p-4"
            >
              <p className="text-xs text-slate-300 leading-snug">{item.impact}</p>
            </InteractiveCard>
          );
        })}
      </div>

      {/* Bottom Interactive Detail + Custom 2D SVG Diagram */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-5">
        <div className="col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Caso Seleccionado
            </span>
            <h3 className="mt-1 text-2xl font-bold text-slate-50">{activeCase.title}</h3>
            <p className="mt-1 text-sm font-medium text-slate-300">{activeCase.domain}</p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  Genotipo Empleado
                </span>
                <p className="mt-1 text-sm text-slate-100">{activeCase.genotype}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Ventaja frente al Diseño Clásico
                </span>
                <p className="mt-1 text-sm text-slate-200">{activeCase.impact}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Haz clic en cada tarjeta superior para inspeccionar el diagrama SVG correspondiente.
          </p>
        </div>

        <div className="col-span-7 flex flex-col justify-center rounded-2xl border border-slate-800 bg-[#070b1a] p-5">
          {selected === 'nasa' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#67e8f9" fontSize="13" fontWeight="700">
                Antena Evolucionada NASA ST5 (Proyección 2D de Geometría Asimétrica)
              </text>
              {/* Radiation lobe */}
              <ellipse cx="260" cy="140" rx="170" ry="88" fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.28)" strokeDasharray="5 5" />
              <ellipse cx="260" cy="140" rx="110" ry="60" fill="rgba(34,211,238,0.09)" stroke="rgba(34,211,238,0.38)" strokeDasharray="3 4" />
              {/* Base feed */}
              <rect x="242" y="214" width="36" height="14" rx="4" fill="#475569" />
              {/* Evolved asymmetric branched wire */}
              <polyline
                points="260,214 260,175 225,148 248,112 212,86 232,58"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="260,175 296,154 278,118 320,96 298,64"
                fill="none"
                stroke="#34d399"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="248,112 276,94 262,62"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text x="342" y="138" fill="#a5f3fc" fontSize="11">
                Lóbulo hemisférico óptimo
              </text>
            </svg>
          )}

          {selected === 'auto' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#fda4af" fontSize="13" fontWeight="700">
                Frente de Pareto Automotriz: Masa Estructural vs. Energía Absorbida
              </text>
              <line x1="65" y1="45" x2="65" y2="218" stroke="#475569" strokeWidth="1.5" />
              <line x1="65" y1="218" x2="475" y2="218" stroke="#475569" strokeWidth="1.5" />
              <text x="270" y="244" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Masa del Chasis (kg) — Minimizar ←
              </text>
              <text x="24" y="135" transform="rotate(-90 24 135)" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Energía Choque (kJ) →
              </text>
              <path
                d="M 110 155 Q 195 95 410 68"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
              {PARETO_POINTS.map((pt, i) => {
                const cx = 65 + ((pt.mass - 190) / 140) * 380;
                const cy = 218 - ((pt.energy - 75) / 70) * 155;
                return (
                  <g key={i}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={pt.nonDominated ? 7 : 5}
                      fill={pt.nonDominated ? '#fb7185' : '#475569'}
                      stroke="#f8fafc"
                      strokeWidth={pt.nonDominated ? 1.5 : 0.8}
                    />
                    {pt.label ? (
                      <text x={cx - 6} y={cy - 11} fill="#fecdd3" fontSize="11" fontWeight="700">
                        {pt.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          )}

          {selected === 'bio' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#6ee7b7" fontSize="13" fontWeight="700">
                Conformación Combinatoria de Plegamiento Proteico (Mínima Energía)
              </text>
              <path
                d="M 80 180 C 120 70, 180 210, 230 110 C 270 40, 330 205, 385 95 C 415 55, 445 130, 465 110"
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
              />
              {[
                [80, 180, 'H'],
                [138, 122, 'P'],
                [188, 152, 'H'],
                [230, 110, 'H'],
                [282, 82, 'P'],
                [335, 148, 'H'],
                [385, 95, 'H'],
                [465, 110, 'P'],
              ].map(([cx, cy, residue], idx) => (
                <g key={idx}>
                  <circle
                    cx={Number(cx)}
                    cy={Number(cy)}
                    r="13"
                    fill={residue === 'H' ? '#065f46' : '#1e293b'}
                    stroke={residue === 'H' ? '#34d399' : '#22d3ee'}
                    strokeWidth="2"
                  />
                  <text
                    x={Number(cx)}
                    y={Number(cy) + 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {residue}
                  </text>
                </g>
              ))}
              <text x="260" y="232" textAnchor="middle" fill="#a7f3d0" fontSize="11">
                Núcleo hidrofóbico (H) compactado vs. residuos polares (P)
              </text>
            </svg>
          )}

          {selected === 'grid' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#fde68a" fontSize="13" fontWeight="700">
                Cromosoma Heterogéneo: Ganancias Continuas PID + Reglas Difusas Discretas
              </text>
              {[
                { label: 'Kp (Real)', val: '1.84', x: 35, w: 92, color: '#22d3ee' },
                { label: 'Ki (Real)', val: '0.42', x: 135, w: 92, color: '#22d3ee' },
                { label: 'Kd (Real)', val: '0.19', x: 235, w: 92, color: '#22d3ee' },
                { label: 'Regla R1', val: '101', x: 345, w: 68, color: '#fbbf24' },
                { label: 'Regla R2', val: '011', x: 420, w: 68, color: '#fbbf24' },
              ].map((gene) => (
                <g key={gene.label} transform={`translate(${gene.x}, 74)`}>
                  <rect
                    width={gene.w}
                    height="68"
                    rx="10"
                    fill="rgba(15,23,42,0.9)"
                    stroke={gene.color}
                    strokeWidth="2"
                  />
                  <text
                    x={gene.w / 2}
                    y="26"
                    textAnchor="middle"
                    fill={gene.color}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {gene.label}
                  </text>
                  <text
                    x={gene.w / 2}
                    y="50"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="15"
                    fontFamily="monospace"
                    fontWeight="800"
                  >
                    {gene.val}
                  </text>
                </g>
              ))}
              <text x="180" y="176" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="600">
                Segmento Real (EE / DE)
              </text>
              <text x="415" y="176" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="600">
                Segmento Discreto (AG)
              </text>
              <text x="260" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Co-evolución simultánea de parámetros de control y lógica de despacho
              </text>
            </svg>
          )}
        </div>
      </div>
    </SlideLayout>
  );
}
