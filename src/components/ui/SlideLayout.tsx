import type { ReactNode } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { getCitationsForSlide } from '../../data/references';
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
  const citations = getCitationsForSlide(meta.id, meta.citationIds);

  const isCover = variant === 'cover';
  const isFullInteractive = variant === 'full-interactive';

  const containerPadding = isCover
    ? 'px-12 pt-14 pb-11'
    : 'px-12 pt-13 pb-10';

  return (
    <div className={`relative flex h-full w-full flex-col ${containerPadding}`}>
      {!isCover ? (
        <header className={`${isFullInteractive ? 'mb-2.5' : 'mb-3.5'} shrink-0`}>
          <div className="mb-1.5 flex items-center gap-2.5">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide uppercase ${accentStyle.badge}`}
            >
              {meta.block}
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-600">
              DIAPOSITIVA {slideNumber} / {totalNumber}
            </span>
          </div>
          <h1 className="text-[38px] font-extrabold tracking-tight text-black leading-[1.08]">
            {meta.title}
          </h1>
          <p className="mt-1 truncate text-[18px] font-medium text-[#1B365D] leading-snug">
            {meta.subtitle}
          </p>
        </header>
      ) : null}

      <main
        className={`min-h-0 flex-1 ${
          variant === 'split'
            ? 'grid grid-cols-12 gap-5 items-stretch'
            : isFullInteractive
              ? 'flex flex-col gap-2.5'
              : 'flex flex-col gap-4'
        }`}
      >
        {children}
      </main>

      {!isCover && (keyTakeaway || citations.length > 0) ? (
        <footer
          className={`${
            isFullInteractive ? 'mt-2' : 'mt-2.5'
          } flex shrink-0 flex-col gap-1 border-t border-slate-200/80 pt-2 pr-44`}
        >
          {keyTakeaway ? (
            <div className="flex min-w-0 items-center gap-2">
              <Sparkles className={`h-4 w-4 shrink-0 ${accentStyle.text}`} />
              <p className="truncate text-[14.5px] font-medium text-[#1B365D] leading-snug">
                <span className={`mr-1.5 font-bold ${accentStyle.text}`}>
                  Idea clave:
                </span>
                {keyTakeaway}
              </p>
            </div>
          ) : null}

          {citations.length > 0 ? (
            <div className="flex min-w-0 items-center gap-1.5 text-[12.5px] leading-tight text-slate-600">
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#2E64B5]" />
              <p className="truncate">
                <span className="mr-1 font-bold text-slate-800">Fuente:</span>
                {citations.map((c, idx) => (
                  <span key={c.id}>
                    {idx > 0 ? <span className="mx-1.5 text-slate-300">·</span> : null}
                    <span className="font-mono font-bold text-[#2E64B5]">[{c.id}]</span>{' '}
                    <span className="font-medium text-slate-800">{c.shortCite}</span>,{' '}
                    <span className="italic">{c.venue}</span>
                    {c.doi ? (
                      <span className="text-slate-500"> (doi:{c.doi})</span>
                    ) : c.url ? (
                      <span className="text-slate-500"> ({c.url})</span>
                    ) : null}
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </footer>
      ) : null}
    </div>
  );
}
