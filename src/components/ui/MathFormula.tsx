import { useMemo } from 'react';
import katex from 'katex';
import type { SemanticAccent } from '../../types/presentation';
import { getAccentStyle } from '../../utils/accentStyles';
import { sanitizeLatex } from '../../utils/latexSanitizer';

export interface MathFormulaProps {
  tex: string;
  block?: boolean;
  label?: string;
  highlight?: boolean;
  className?: string;
  accent?: SemanticAccent;
}

export function MathFormula({
  tex,
  block = false,
  label,
  highlight = false,
  className = '',
  accent = 'cyan',
}: MathFormulaProps) {
  const accentStyle = getAccentStyle(accent);

  const html = useMemo(() => {
    const cleaned = sanitizeLatex(tex);
    return katex.renderToString(cleaned, {
      displayMode: block,
      throwOnError: false,
      strict: false,
    });
  }, [tex, block]);

  if (!block && !highlight && !label) {
    return (
      <span
        className={`inline-flex items-baseline align-baseline text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (!block) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 ${
          highlight
            ? `${accentStyle.border} ${accentStyle.bgSoft} text-slate-50`
            : 'border-slate-700/70 bg-slate-900/75 text-slate-100'
        } ${className}`}
      >
        {label ? (
          <span className={`text-xs font-semibold uppercase tracking-wider ${accentStyle.text}`}>
            {label}
          </span>
        ) : null}
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </span>
    );
  }

  return (
    <div
      className={`rounded-2xl border px-5 py-4 backdrop-blur-md transition-colors ${
        highlight
          ? `${accentStyle.activeBorder} bg-slate-900/90`
          : 'border-slate-700/70 bg-slate-900/75'
      } ${className}`}
    >
      {label ? (
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${accentStyle.trackBg}`}
            aria-hidden="true"
          />
          <span className={`text-xs font-semibold uppercase tracking-widest ${accentStyle.text}`}>
            {label}
          </span>
        </div>
      ) : null}
      <div
        className="overflow-x-auto py-1 text-center text-slate-50"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
