import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import type { SlideMeta } from '../../types/presentation';
import { getAccentStyle, getBlockAccent } from '../../utils/accentStyles';

export interface SlideLayoutProps {
  meta: SlideMeta;
  totalSlides: number;
  variant?: 'cover' | 'standard' | 'split' | 'full-interactive';
  keyTakeaway?: string;
  children: ReactNode;
}

export function SlideLayout({
  meta,
  totalSlides,
  variant = 'standard',
  keyTakeaway,
  children,
}: SlideLayoutProps) {
  const accent = getBlockAccent(meta.block);
  const accentStyle = getAccentStyle(accent);
  const slideNumber = String(meta.id).padStart(2, '0');
  const totalNumber = String(totalSlides).padStart(2, '0');

  const isCover = variant === 'cover';
  const isFullInteractive = variant === 'full-interactive';

  const containerPadding = isFullInteractive
    ? 'px-10 pt-14 pb-12'
    : 'px-14 pt-20 pb-16';

  return (
    <div className={`relative flex h-full w-full flex-col ${containerPadding}`}>
      {!isCover && isFullInteractive ? (
        <header className="mb-3 shrink-0 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${accentStyle.badge}`}
              >
                {meta.block}
              </span>
              <span className="shrink-0 font-mono text-[11px] font-semibold tracking-widest text-slate-400">
                DIAPOSITIVA {slideNumber} / {totalNumber}
              </span>
              <span className="text-slate-700">·</span>
              <h1 className="truncate text-2xl font-bold tracking-tight text-slate-50 leading-tight">
                {meta.title}
              </h1>
            </div>
            <p className="hidden max-w-md shrink-0 truncate text-xs text-slate-400 xl:block">
              {meta.subtitle}
            </p>
          </div>
        </header>
      ) : null}

      {!isCover && !isFullInteractive ? (
        <header className="mb-5 flex shrink-0 items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${accentStyle.badge}`}
              >
                {meta.block}
              </span>
              <span className="font-mono text-xs font-semibold tracking-widest text-slate-400">
                DIAPOSITIVA {slideNumber} / {totalNumber}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 leading-tight">
              {meta.title}
            </h1>
            <p className="mt-1.5 max-w-5xl text-base text-slate-300 leading-snug">
              {meta.subtitle}
            </p>
          </div>
        </header>
      ) : null}

      <main
        className={`min-h-0 flex-1 ${
          variant === 'split'
            ? 'grid grid-cols-12 gap-6 items-stretch'
            : isFullInteractive
              ? 'flex flex-col gap-3'
              : 'flex flex-col gap-5'
        }`}
      >
        {children}
      </main>

      {keyTakeaway ? (
        <footer
          className={`${
            isFullInteractive ? 'mt-2.5' : 'mt-4'
          } flex shrink-0 items-center pr-52`}
        >
          <div
            className={`inline-flex max-w-5xl items-center gap-3 rounded-xl border ${
              isFullInteractive ? 'px-3.5 py-2' : 'px-4 py-2.5'
            } bg-slate-900/85 backdrop-blur-md ${accentStyle.border}`}
          >
            <Sparkles className={`h-4 w-4 shrink-0 ${accentStyle.text}`} />
            <p className="text-sm font-medium text-slate-200 leading-snug">
              <span className={`mr-1.5 font-semibold ${accentStyle.text}`}>
                Idea clave:
              </span>
              {keyTakeaway}
            </p>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
