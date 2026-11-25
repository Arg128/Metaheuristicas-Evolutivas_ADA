/**
 * Sanitizes common OCR / PDF extraction typos into valid KaTeX expressions.
 */
export function sanitizeLatex(tex: string): string {
  if (!tex) return '';

  return tex
    .replace(/(?:\\|\b)ifrac\b/g, '\\frac')
    .replace(/(?:\\|\b)isum\b/g, '\\sum')
    .replace(/(?:\\|\b)lcos\b/g, '\\cos')
    .replace(/(?:\\|\b)lpi\b/g, '\\pi')
    .replace(/g\s*<_\s*g_0/g, 'g \\leftarrow 0')
    .replace(/<-/g, '\\leftarrow')
    .trim();
}
