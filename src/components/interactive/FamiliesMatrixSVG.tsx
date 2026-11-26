import { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, Cpu, GitBranch, MoveUpRight, Sigma } from 'lucide-react';
import type { SemanticAccent } from '../../types/presentation';
import { getAccentStyle } from '../../utils/accentStyles';

type DomainFilter = 'all' | 'discreto' | 'continuo' | 'sintesis';

interface FamilyItem {
  code: 'AG' | 'EE' | 'PE' | 'PG' | 'DE';
  name: string;
  domain: Exclude<DomainFilter, 'all'>;
  domainLabel: string;
  accent: SemanticAccent;
  representation: string;
  operator: string;
  useCase: string;
  icon: typeof Binary;
}

const FAMILIES: FamilyItem[] = [
  {
    code: 'AG',
    name: 'Algoritmos Genéticos',
    domain: 'discreto',
    domainLabel: 'Discreto / Combinatorio',
    accent: 'violet',
    representation: 'Cadenas binarias / enteras',
    operator: 'Cruce + bit-flip',
    useCase: 'Asignación combinatoria, selección de rasgos y codificación discreta.',
    icon: Binary,
  },
  {
    code: 'EE',
    name: 'Estrategias Evolutivas',
    domain: 'continuo',
    domainLabel: 'Continuo / Paramétrico',
    accent: 'cyan',
    representation: 'Vectores reales + pasos σ',
    operator: 'Mutación gaussiana auto-adaptativa',
    useCase: 'Optimización paramétrica continua y diseño aerodinámico de alta precisión.',
    icon: Sigma,
  },
  {
    code: 'PE',
    name: 'Programación Evolutiva',
    domain: 'sintesis',
    domainLabel: 'Síntesis de Programas',
    accent: 'amber',
    representation: 'Autómatas finitos / fenotipos',
    operator: 'Mutación fenotípica sin cruce',
    useCase: 'Predicción secuencial y evolución de máquinas de estados reactivas.',
    icon: Cpu,
  },
  {
    code: 'PG',
    name: 'Programación Genética',
    domain: 'sintesis',
    domainLabel: 'Síntesis de Programas',
    accent: 'emerald',
    representation: 'Árboles sintácticos ejecutables',
    operator: 'Intercambio de subárboles',
    useCase: 'Regresión simbólica y síntesis automática de expresiones o reglas.',
    icon: GitBranch,
  },
  {
    code: 'DE',
    name: 'Evolución Diferencial',
    domain: 'continuo',
    domainLabel: 'Continuo / Paramétrico',
    accent: 'rose',
    representation: 'Vectores reales x ∈ ℝᴰ',
    operator: 'Diferencia vectorial F·(x_r2 − x_r3)',
    useCase: 'Optimización continua multimodal no derivable en ingeniería y control.',
    icon: MoveUpRight,
  },
];

function FamilyMicroSVG({ code, active }: { code: FamilyItem['code']; active: boolean }) {
  if (code === 'AG') {
    const bits = ['1', '0', '1', '1', '0', '1'];
    return (
      <svg viewBox="0 0 180 74" className="h-[74px] w-full rounded-lg border border-slate-200 bg-slate-50">
        {bits.map((b, i) => (
          <g key={i} transform={`translate(${12 + i * 26}, 22)`}>
            <rect
              width="22"
              height="26"
              rx="4"
              fill={i < 3 ? '#ede9fe' : '#cffafe'}
              stroke={i < 3 ? '#7c3aed' : '#0891b2'}
              strokeWidth="1.2"
            />
            <text x="11" y="17.5" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
              {b}
            </text>
          </g>
        ))}
        <motion.line
          x1="88"
          y1="8"
          x2="88"
          y2="64"
          stroke="#d97706"
          strokeWidth="2"
          strokeDasharray="4 3"
          animate={{ opacity: active ? [0.4, 1, 0.4] : 0.7 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="90" y="65" textAnchor="middle" fill="#475569" fontSize="8.5" fontWeight="600">
          Corte de recombinación
        </text>
      </svg>
    );
  }

  if (code === 'EE') {
    return (
      <svg viewBox="0 0 180 74" className="h-[74px] w-full rounded-lg border border-slate-200 bg-slate-50">
        <line x1="20" y1="37" x2="160" y2="37" stroke="rgba(15,23,42,0.14)" />
        <line x1="90" y1="8" x2="90" y2="66" stroke="rgba(15,23,42,0.14)" />
        <motion.ellipse
          cx="90"
          cy="37"
          rx="42"
          ry="18"
          transform="rotate(-14 90 37)"
          fill="rgba(8,145,178,0.14)"
          stroke="#0891b2"
          strokeWidth="1.5"
          animate={active ? { rx: [36, 46, 36], ry: [15, 22, 15] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="90" cy="37" r="4" fill="#059669" />
        <text x="140" y="20" fill="#0e7490" fontSize="9" fontWeight="700">
          N(0, σ²)
        </text>
      </svg>
    );
  }

  if (code === 'PE') {
    return (
      <svg viewBox="0 0 180 74" className="h-[74px] w-full rounded-lg border border-slate-200 bg-slate-50">
        <path d="M 46 37 L 78 37" stroke="#d97706" strokeWidth="1.6" />
        <path d="M 104 37 L 136 37" stroke="#d97706" strokeWidth="1.6" />
        <path d="M 146 25 Q 90 4 36 25" fill="none" stroke="rgba(217,119,6,0.55)" strokeWidth="1.3" strokeDasharray="3 3" />
        {[
          { x: 34, label: 'S₀' },
          { x: 90, label: 'S₁' },
          { x: 146, label: 'S₂' },
        ].map((node, idx) => (
          <g key={node.label}>
            <motion.circle
              cx={node.x}
              cy="37"
              r="13"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="1.5"
              animate={active ? { scale: [1, 1.09, 1] } : undefined}
              transition={{ duration: 1.6, delay: idx * 0.35, repeat: Infinity }}
            />
            <text x={node.x} y="41" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="700">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  if (code === 'PG') {
    return (
      <svg viewBox="0 0 180 74" className="h-[74px] w-full rounded-lg border border-slate-200 bg-slate-50">
        <line x1="90" y1="17" x2="54" y2="38" stroke="#64748b" strokeWidth="1.5" />
        <line x1="90" y1="17" x2="126" y2="38" stroke="#059669" strokeWidth="1.8" />
        <line x1="126" y1="38" x2="108" y2="59" stroke="#059669" strokeWidth="1.5" />
        <line x1="126" y1="38" x2="146" y2="59" stroke="#059669" strokeWidth="1.5" />
        <motion.rect
          x="94"
          y="25"
          width="66"
          height="43"
          rx="7"
          fill="rgba(5,150,105,0.09)"
          stroke="#059669"
          strokeDasharray="3 2"
          animate={active ? { opacity: [0.45, 1, 0.45] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {[
          { x: 90, y: 17, t: '+' },
          { x: 54, y: 38, t: 'x' },
          { x: 126, y: 38, t: '*' },
          { x: 108, y: 58, t: 'sin' },
          { x: 146, y: 58, t: 'x' },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="9.5" fill="#ffffff" stroke="#059669" strokeWidth="1.4" />
            <text x={n.x} y={n.y + 3.2} textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="700">
              {n.t}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // DE: vector difference x_r1 + F * (x_r2 - x_r3)
  return (
    <svg viewBox="0 0 180 74" className="h-[74px] w-full rounded-lg border border-slate-200 bg-slate-50">
      {/* x_r3 -> x_r2 difference */}
      <line x1="30" y1="54" x2="88" y2="24" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* x_r1 -> mutant v_i */}
      <motion.line
        x1="92"
        y1="56"
        x2="150"
        y2="26"
        stroke="#e11d48"
        strokeWidth="2.3"
        animate={active ? { pathLength: [0.3, 1, 1] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle cx="30" cy="54" r="4" fill="#64748b" />
      <text x="20" y="65" fill="#475569" fontSize="8" fontWeight="600">r₃</text>
      <circle cx="88" cy="24" r="4" fill="#64748b" />
      <text x="86" y="16" fill="#475569" fontSize="8" fontWeight="600">r₂</text>
      <circle cx="92" cy="56" r="4.5" fill="#0891b2" />
      <text x="90" y="68" fill="#0e7490" fontSize="8" fontWeight="700">x_r₁</text>
      <circle cx="150" cy="26" r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.2" />
      <text x="155" y="21" fill="#be123c" fontSize="8.5" fontWeight="700">vᵢ</text>
    </svg>
  );
}

export interface FamiliesMatrixSVGProps {
  selectedCode: FamilyItem['code'];
  onSelectCode: (code: FamilyItem['code']) => void;
}

export function FamiliesMatrixSVG({ selectedCode, onSelectCode }: FamiliesMatrixSVGProps) {
  const [filter, setFilter] = useState<DomainFilter>('all');

  const selected = FAMILIES.find((f) => f.code === selectedCode) ?? FAMILIES[4];

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 px-5 py-2.5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <p className="text-xs text-slate-700">
          Filtra por dominio o selecciona cualquiera de las <strong className="text-slate-900">5 familias</strong> para animar su operador dominante.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {(
            [
              { id: 'all', label: 'Todos (5)' },
              { id: 'discreto', label: 'Discreto / Combinatorio' },
              { id: 'continuo', label: 'Continuo / Paramétrico' },
              { id: 'sintesis', label: 'Síntesis de Programas' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                filter === item.id
                  ? 'border-violet-500 bg-violet-50 text-violet-900 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Animated Cards */}
      <div className="grid grid-cols-5 gap-3">
        {FAMILIES.map((family) => {
          const Icon = family.icon;
          const accent = getAccentStyle(family.accent);
          const isSelected = selectedCode === family.code;
          const isDimmed = filter !== 'all' && family.domain !== filter;

          return (
            <motion.button
              key={family.code}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectCode(family.code)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                isSelected
                  ? `${accent.activeBorder} bg-white`
                  : 'border-slate-200 bg-white/90 shadow-xs hover:border-slate-300'
              } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accent.border} ${accent.bgSoft} ${accent.text}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold ${accent.badge}`}>
                    {family.code}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{family.name}</h4>
                <p className="mt-0.5 text-[11px] text-slate-600">{family.domainLabel}</p>
              </div>

              <div className="my-2.5">
                <FamilyMicroSVG code={family.code} active={isSelected} />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                  <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                    Representación
                  </span>
                  <span className="font-medium text-slate-800">{family.representation}</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                  <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                    Operador Dominante
                  </span>
                  <span className={`font-medium ${accent.text}`}>{family.operator}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Detail Strip */}
      <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 text-xs text-slate-700 shadow-xs">
        <strong className="text-violet-800">
          {selected.code} — {selected.name}:
        </strong>{' '}
        {selected.useCase}
      </div>
    </div>
  );
}
