import { ExactVsGeneticRace } from '../components/interactive/ExactVsGeneticRace';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide14RaceExactVsGA({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="full-interactive"
      keyTakeaway="Mientras la grilla exhaustiva barre ciegamente ((b−a)/Δ)^D celdas sin memoria, el Algoritmo Genético concentra evaluaciones en las cuencas de menor costo."
    >
      <ExactVsGeneticRace
        formulaTex={meta.keyFormula?.tex}
        formulaLabel={meta.keyFormula?.label}
      />
    </SlideLayout>
  );
}
