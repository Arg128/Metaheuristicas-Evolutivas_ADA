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
    hex: '#22d3ee',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    activeBorder: 'border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.22)]',
    bgSoft: 'bg-cyan-500/10',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/35',
    glow: 'from-cyan-400/20 via-cyan-500/5 to-transparent',
    trackBg: 'bg-cyan-400',
  },
  emerald: {
    hex: '#34d399',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    activeBorder: 'border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.22)]',
    bgSoft: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/35',
    glow: 'from-emerald-400/20 via-emerald-500/5 to-transparent',
    trackBg: 'bg-emerald-400',
  },
  violet: {
    hex: '#a78bfa',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    activeBorder: 'border-violet-400 shadow-[0_0_24px_rgba(167,139,250,0.22)]',
    bgSoft: 'bg-violet-500/10',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-400/35',
    glow: 'from-violet-400/20 via-violet-500/5 to-transparent',
    trackBg: 'bg-violet-400',
  },
  amber: {
    hex: '#fbbf24',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    activeBorder: 'border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.22)]',
    bgSoft: 'bg-amber-500/10',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/35',
    glow: 'from-amber-400/20 via-amber-500/5 to-transparent',
    trackBg: 'bg-amber-400',
  },
  rose: {
    hex: '#fb7185',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    activeBorder: 'border-rose-400 shadow-[0_0_24px_rgba(251,113,133,0.22)]',
    bgSoft: 'bg-rose-500/10',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/35',
    glow: 'from-rose-400/20 via-rose-500/5 to-transparent',
    trackBg: 'bg-rose-400',
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
