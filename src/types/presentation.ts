export type ThematicBlock =
  | 'Fundamentos y Taxonomía'
  | 'Operadores Evolutivos'
  | 'Simulación y Comparativa'
  | 'Análisis y Límites'
  | 'Aplicaciones y Cierre';

export type SemanticAccent = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';

export type SpeakerId = 'Maritza' | 'Fredy' | 'Jhoans' | 'Ángel';

export interface ReferenceItem {
  id: string;
  shortCite: string;
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi?: string;
  url?: string;
  slides: number[];
  speakerGroup: SpeakerId;
}

export interface SlideMeta {
  id: number;
  slug: string;
  block: ThematicBlock;
  speaker: SpeakerId;
  speakerRange: string;
  title: string;
  subtitle: string;
  pedagogicalGoal: string;
  /** Exclusively rendered inside PresenterNotesModal, never on the projected slide canvas. */
  speakerScript: string;
  interactionHint?: string;
  plannedVisualSummary: string;
  citationIds: string[];
  keyFormula?: {
    label: string;
    tex: string;
  };
}
