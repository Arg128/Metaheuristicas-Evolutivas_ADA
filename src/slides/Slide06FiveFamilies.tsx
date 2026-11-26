import { useState } from 'react';
import { FamiliesMatrixSVG } from '../components/interactive/FamiliesMatrixSVG';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

const FAMILY_CODES: ('AG' | 'EE' | 'PE' | 'PG' | 'DE')[] = ['AG', 'EE', 'PE', 'PG', 'DE'];

export function Slide06FiveFamilies({ meta, totalSlides }: SlideProps) {
  const [selectedCode, setSelectedCode] = useState<'AG' | 'EE' | 'PE' | 'PG' | 'DE'>('DE');

  useSlideKeyboard({
    onNextState: () =>
      setSelectedCode((prev) => FAMILY_CODES[(FAMILY_CODES.indexOf(prev) + 1) % FAMILY_CODES.length]),
    onPrevState: () =>
      setSelectedCode(
        (prev) =>
          FAMILY_CODES[(FAMILY_CODES.indexOf(prev) - 1 + FAMILY_CODES.length) % FAMILY_CODES.length],
      ),
    onSelectNumber: (idx) => {
      if (idx < FAMILY_CODES.length) setSelectedCode(FAMILY_CODES[idx]);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="standard"
      keyTakeaway="Las cinco familias evolutivas (AG, EE, PE, PG y Evolución Diferencial DE) comparten selección estocástica, pero se especializan según su representación y operador dominante."
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
        <FamiliesMatrixSVG selectedCode={selectedCode} onSelectCode={setSelectedCode} />

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="violet"
            className="!py-2.5"
          />
        ) : null}
      </div>
    </SlideLayout>
  );
}
