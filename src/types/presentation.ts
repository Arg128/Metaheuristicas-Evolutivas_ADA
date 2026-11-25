export type ThematicBlock =
  | 'Fundamentos y Taxonomía'
  | 'Operadores Evolutivos'
  | 'Simulación y Comparativa'
  | 'Análisis y Límites'
  | 'Aplicaciones y Cierre';

export type SemanticAccent = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';

export interface SlideMeta {
  id: number;
  slug: string;
  block: ThematicBlock;
  title: string;
  subtitle: string;
  pedagogicalGoal: string;
  /** Exclusively rendered inside PresenterNotesModal, never on the projected slide canvas. */
  speakerScript: string;
  interactionHint?: string;
  plannedVisualSummary: string;
  keyFormula?: {
    label: string;
    tex: string;
  };
}
