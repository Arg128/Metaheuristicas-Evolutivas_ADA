import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BottomControlsProps {
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}

export function BottomControls({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
}: BottomControlsProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= totalSlides - 1;
  const currentStr = String(currentIndex + 1).padStart(2, '0');
  const totalStr = String(totalSlides).padStart(2, '0');

  return (
    <div className="pointer-events-auto fixed right-5 bottom-4 z-40 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-2.5 py-1.5 text-slate-800 backdrop-blur-md shadow-lg shadow-slate-900/10">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Diapositiva anterior"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="min-w-[64px] text-center font-mono text-xs font-semibold tabular-nums text-slate-800">
        {currentStr} / {totalStr}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        aria-label="Siguiente diapositiva"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <span className="hidden border-l border-slate-200 pl-2.5 pr-1 font-mono text-[11px] text-slate-500 sm:inline">
        ← →
      </span>
    </div>
  );
}
