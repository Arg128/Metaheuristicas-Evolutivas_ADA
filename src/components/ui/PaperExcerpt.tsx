import type { ReactNode } from 'react';
import { MathFormula } from './MathFormula';

export interface PaperTermHighlightProps {
  children: ReactNode;
  accentColor?: 'blue' | 'crimson';
}

export function PaperTermHighlight({
  children,
  accentColor = 'blue',
}: PaperTermHighlightProps) {
  const borderColor =
    accentColor === 'crimson'
      ? 'border-[#E03A1E] bg-rose-50/50 text-[#991b1b]'
      : 'border-[#2E64B5] bg-blue-50/45 text-[#1B365D]';

  return (
    <span
      className={`inline-block border-[1.5px] px-1.5 py-0 font-semibold not-italic leading-snug ${borderColor}`}
    >
      {children}
    </span>
  );
}

export interface PaperExcerptProps {
  category: string;
  sourceTag: string;
  children: ReactNode;
  formulaTex?: string;
  equationNumber?: string;
  accentColor?: 'blue' | 'crimson';
  className?: string;
}

export function PaperExcerpt({
  category,
  sourceTag,
  children,
  formulaTex,
  equationNumber,
  accentColor = 'blue',
  className = '',
}: PaperExcerptProps) {
  const ruleClass =
    accentColor === 'crimson' ? 'border-l-[#E03A1E]' : 'border-l-[#2E64B5]';
  const tagClass =
    accentColor === 'crimson'
      ? 'border-rose-200 bg-rose-50 text-[#E03A1E]'
      : 'border-blue-200 bg-blue-50/80 text-[#2E64B5]';

  return (
    <div
      className={`rounded-r-xl border border-slate-200/90 border-l-[3.5px] ${ruleClass} bg-white px-4 py-2.5 shadow-sm shadow-slate-900/5 ${className}`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-paper text-[14.5px] font-bold text-black">
          {category}
        </span>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${tagClass}`}
        >
          {sourceTag}
        </span>
      </div>

      <p className="font-paper text-[15.5px] italic leading-snug text-slate-900">
        {children}
      </p>

      {formulaTex ? (
        <div className="mt-1.5 flex items-center justify-between gap-3 rounded-lg bg-slate-50/90 px-3 py-2">
          <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden text-center text-[15px]">
            <MathFormula tex={formulaTex} />
          </div>
          {equationNumber ? (
            <span className="font-paper shrink-0 text-[13px] font-semibold text-slate-600">
              {equationNumber}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
