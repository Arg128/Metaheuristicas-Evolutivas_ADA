import { useState } from 'react';
import { Car, Dna, Radio, Zap } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
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
  refTag: string;
  accent: SemanticAccent;
  genotype: string;
  impact: string;
  shortImpact: string;
  icon: typeof Radio;
}

const CASES: RealCase[] = [
  {
    id: 'nasa',
    title: 'Aeroespacial (NASA ST5)',
    domain: 'Antena Espacial Evolucionada',
    refTag: 'Hornby et al. (2006) [R16]',
    accent: 'cyan',
    genotype: 'Árbol constructivo de segmentos y ángulos 3D.',
    impact: 'Geometría asimétrica con mayor ganancia hemisférica y menor masa que diseños humanos.',
    shortImpact: 'Supera diseños humanos en ganancia y masa.',
    icon: Radio,
  },
  {
    id: 'auto',
    title: 'Automotriz (NSGA-II)',
    domain: 'Chasis y Absorción de Impacto',
    refTag: 'Deb et al. (2002) [R17]',
    accent: 'rose',
    genotype: 'Vector real de espesores y aleaciones estructurales.',
    impact: 'Frente de Pareto óptimo entre absorción de energía de choque y reducción de peso.',
    shortImpact: 'Frente de Pareto óptimo seguridad vs. peso.',
    icon: Car,
  },
  {
    id: 'bio',
    title: 'Bioinformática y Medicina',
    domain: 'Plegamiento Proteico',
    refTag: 'Eiben & Smith (2015) [R2]',
    accent: 'emerald',
    genotype: 'Secuencias discretas y ángulos diedros combinatorios.',
    impact: 'Explora paisajes conformacionales masivos no derivables en diseño de fármacos.',
    shortImpact: 'Explora conformaciones sin derivadas.',
    icon: Dna,
  },
  {
    id: 'grid',
    title: 'Sistemas Eléctricos',
    domain: 'Control Híbrido PID + Difuso',
    refTag: 'Talbi (2009) [R1]',
    accent: 'amber',
    genotype: 'Cromosoma heterogéneo: reales (Kp, Ki, Kd) + reglas discretas.',
    impact: 'Co-optimiza estabilidad transitoria y despacho económico en microrredes.',
    shortImpact: 'Co-optimiza parámetros continuos y discretos.',
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
  const caseOrder: CaseId[] = ['nasa', 'auto', 'bio', 'grid'];

  useSlideKeyboard({
    onNextState: () =>
      setSelected((prev) => caseOrder[(caseOrder.indexOf(prev) + 1) % caseOrder.length]),
    onPrevState: () =>
      setSelected(
        (prev) => caseOrder[(caseOrder.indexOf(prev) - 1 + caseOrder.length) % caseOrder.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < caseOrder.length) setSelected(caseOrder[idx]);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="En ingeniería real, los algoritmos evolutivos destacan en geometrías no intuitivas, Frentes de Pareto y cromosomas mixtos."
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
              className="!p-3.5"
            >
              <p className="text-sm font-medium leading-snug text-[#1B365D]">{item.shortImpact}</p>
            </InteractiveCard>
          );
        })}
      </div>

      {/* Bottom Interactive Detail + Custom 2D SVG Diagram */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-5">
        <div className="col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Caso Documentado
              </span>
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-[#2E64B5]">
                {activeCase.refTag}
              </span>
            </div>
            <h3 className="mt-1.5 text-2xl font-bold text-black">{activeCase.title}</h3>
            <p className="mt-0.5 text-base font-medium text-[#1B365D]">{activeCase.domain}</p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-cyan-700">
                  Genotipo Empleado
                </span>
                <p className="mt-1 text-base font-medium text-slate-900">{activeCase.genotype}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Impacto frente al Diseño Clásico
                </span>
                <p className="mt-1 text-base font-medium text-[#1B365D]">{activeCase.impact}</p>
              </div>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-500">
            Haz clic en cada tarjeta superior para cambiar el esquema SVG.
          </p>
        </div>

        <div className="col-span-7 flex flex-col justify-center rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5">
          {selected === 'nasa' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#0e7490" fontSize="14.5" fontWeight="700">
                Antena Evolucionada NASA ST5 (Geometría Asimétrica)
              </text>
              <ellipse cx="260" cy="140" rx="170" ry="88" fill="rgba(8,145,178,0.06)" stroke="rgba(8,145,178,0.32)" strokeDasharray="5 5" />
              <ellipse cx="260" cy="140" rx="110" ry="60" fill="rgba(8,145,178,0.1)" stroke="rgba(8,145,178,0.45)" strokeDasharray="3 4" />
              <rect x="242" y="214" width="36" height="14" rx="4" fill="#475569" />
              <polyline
                points="260,214 260,175 225,148 248,112 212,86 232,58"
                fill="none"
                stroke="#0891b2"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="260,175 296,154 278,118 320,96 298,64"
                fill="none"
                stroke="#059669"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="248,112 276,94 262,62"
                fill="none"
                stroke="#d97706"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <text x="336" y="138" fill="#0e7490" fontSize="13" fontWeight="700">
                Lóbulo hemisférico óptimo
              </text>
            </svg>
          )}

          {selected === 'auto' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#be123c" fontSize="14.5" fontWeight="700">
                Frente de Pareto NSGA-II: Masa vs. Energía Absorbida
              </text>
              <line x1="65" y1="45" x2="65" y2="218" stroke="#64748b" strokeWidth="1.5" />
              <line x1="65" y1="218" x2="475" y2="218" stroke="#64748b" strokeWidth="1.5" />
              <text x="270" y="246" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">
                Masa del Chasis (kg) — Minimizar ←
              </text>
              <text x="24" y="135" transform="rotate(-90 24 135)" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">
                Energía Choque (kJ) →
              </text>
              <path
                d="M 110 155 Q 195 95 410 68"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.8"
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
                      r={pt.nonDominated ? 7.5 : 5.5}
                      fill={pt.nonDominated ? '#e11d48' : '#94a3b8'}
                      stroke="#ffffff"
                      strokeWidth={pt.nonDominated ? 1.8 : 1}
                    />
                    {pt.label ? (
                      <text x={cx - 7} y={cy - 12} fill="#be123c" fontSize="12.5" fontWeight="700">
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
              <text x="20" y="24" fill="#047857" fontSize="14.5" fontWeight="700">
                Plegamiento Proteico Combinatorio (Mínima Energía)
              </text>
              <path
                d="M 80 180 C 120 70, 180 210, 230 110 C 270 40, 330 205, 385 95 C 415 55, 445 130, 465 110"
                fill="none"
                stroke="#059669"
                strokeWidth="4.2"
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
                    r="14"
                    fill={residue === 'H' ? '#059669' : '#e0f2fe'}
                    stroke={residue === 'H' ? '#047857' : '#0891b2'}
                    strokeWidth="2"
                  />
                  <text
                    x={Number(cx)}
                    y={Number(cy) + 4.5}
                    textAnchor="middle"
                    fill={residue === 'H' ? '#ffffff' : '#0e7490'}
                    fontSize="12.5"
                    fontWeight="800"
                  >
                    {residue}
                  </text>
                </g>
              ))}
              <text x="260" y="234" textAnchor="middle" fill="#047857" fontSize="13" fontWeight="700">
                Núcleo hidrofóbico (H) compactado vs. residuos polares (P)
              </text>
            </svg>
          )}

          {selected === 'grid' && (
            <svg viewBox="0 0 520 260" className="h-full w-full">
              <text x="20" y="24" fill="#b45309" fontSize="14.5" fontWeight="700">
                Cromosoma Heterogéneo: PID Continuo + Reglas Discretas
              </text>
              {[
                { label: 'Kp (Real)', val: '1.84', x: 35, w: 92, color: '#0891b2', bg: '#ecfeff' },
                { label: 'Ki (Real)', val: '0.42', x: 135, w: 92, color: '#0891b2', bg: '#ecfeff' },
                { label: 'Kd (Real)', val: '0.19', x: 235, w: 92, color: '#0891b2', bg: '#ecfeff' },
                { label: 'Regla R1', val: '101', x: 345, w: 68, color: '#d97706', bg: '#fffbeb' },
                { label: 'Regla R2', val: '011', x: 420, w: 68, color: '#d97706', bg: '#fffbeb' },
              ].map((gene) => (
                <g key={gene.label} transform={`translate(${gene.x}, 74)`}>
                  <rect width={gene.w} height="70" rx="10" fill={gene.bg} stroke={gene.color} strokeWidth="2" />
                  <text x={gene.w / 2} y="27" textAnchor="middle" fill={gene.color} fontSize="12" fontWeight="700">
                    {gene.label}
                  </text>
                  <text
                    x={gene.w / 2}
                    y="52"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="16"
                    fontFamily="monospace"
                    fontWeight="800"
                  >
                    {gene.val}
                  </text>
                </g>
              ))}
              <text x="180" y="178" textAnchor="middle" fill="#0e7490" fontSize="13" fontWeight="700">
                Segmento Real (EE / DE)
              </text>
              <text x="415" y="178" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="700">
                Segmento Discreto (AG)
              </text>
              <text x="260" y="222" textAnchor="middle" fill="#334155" fontSize="12.5" fontWeight="600">
                Co-evolución simultánea de parámetros de control y lógica de despacho
              </text>
            </svg>
          )}
        </div>
      </div>
    </SlideLayout>
  );
}
