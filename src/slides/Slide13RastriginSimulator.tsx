import { RastriginSimulator } from '../components/interactive/RastriginSimulator';
import { SlideLayout } from '../components/ui/SlideLayout';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

export function Slide13RastriginSimulator({ meta, totalSlides }: SlideProps) {
  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="full-interactive"
      keyTakeaway="Sobre Rastrigin 2D, cada línea del pseudocódigo transforma geométricamente la población hasta concentrarla en (0, 0) mediante Mulberry32."
    >
      <RastriginSimulator
        formulaTex={meta.keyFormula?.tex}
        formulaLabel={meta.keyFormula?.label}
      />
    </SlideLayout>
  );
}
