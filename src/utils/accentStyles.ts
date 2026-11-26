import type { SemanticAccent, ThematicBlock } from '../types/presentation';

export interface AccentStyle {
  hex: string;
  text: string;
  border: string;
  activeBorder: string;
  bgSoft: string;
  badge: string;
  glow: string;
  trackBg: string;
}

const ACCENT_MAP: Record<SemanticAccent, AccentStyle> = {
  cyan: {
    hex: '#0891b2',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    activeBorder: 'border-cyan-500 ring-1 ring-cyan-500/20 shadow-md shadow-cyan-900/10',
    bgSoft: 'bg-cyan-50',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    glow: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    trackBg: 'bg-cyan-600',
  },
  emerald: {
    hex: '#059669',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-500 ring-1 ring-emerald-500/20 shadow-md shadow-emerald-900/10',
    bgSoft: 'bg-emerald-50',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    glow: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    trackBg: 'bg-emerald-600',
  },
  violet: {
    hex: '#7c3aed',
    text: 'text-violet-700',
    border: 'border-violet-200',
    activeBorder: 'border-violet-500 ring-1 ring-violet-500/20 shadow-md shadow-violet-900/10',
    bgSoft: 'bg-violet-50',
    badge: 'bg-violet-50 text-violet-800 border-violet-200',
    glow: 'from-violet-500/10 via-violet-500/5 to-transparent',
    trackBg: 'bg-violet-600',
  },
  amber: {
    hex: '#d97706',
    text: 'text-amber-700',
    border: 'border-amber-200',
    activeBorder: 'border-amber-500 ring-1 ring-amber-500/20 shadow-md shadow-amber-900/10',
    bgSoft: 'bg-amber-50',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    glow: 'from-amber-500/10 via-amber-500/5 to-transparent',
    trackBg: 'bg-amber-600',
  },
  rose: {
    hex: '#e11d48',
    text: 'text-rose-700',
    border: 'border-rose-200',
    activeBorder: 'border-rose-500 ring-1 ring-rose-500/20 shadow-md shadow-rose-900/10',
    bgSoft: 'bg-rose-50',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    glow: 'from-rose-500/10 via-rose-500/5 to-transparent',
    trackBg: 'bg-rose-600',
  },
};

export function getAccentStyle(accent: SemanticAccent = 'cyan'): AccentStyle {
  return ACCENT_MAP[accent];
}

export function getBlockAccent(block: ThematicBlock): SemanticAccent {
  switch (block) {
    case 'Fundamentos y Taxonomía':
      return 'cyan';
    case 'Operadores Evolutivos':
      return 'violet';
    case 'Simulación y Comparativa':
      return 'emerald';
    case 'Análisis y Límites':
      return 'amber';
    case 'Aplicaciones y Cierre':
      return 'rose';
  }
}
