import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { SemanticAccent } from '../../types/presentation';
import { getAccentStyle } from '../../utils/accentStyles';

export interface InteractiveCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  accent?: SemanticAccent;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function InteractiveCard({
  title,
  subtitle,
  badge,
  icon,
  accent = 'cyan',
  active = false,
  onClick,
  children,
  className = '',
}: InteractiveCardProps) {
  const accentStyle = getAccentStyle(accent);
  const isClickable = Boolean(onClick);

  const sharedClasses = `relative w-full text-left rounded-2xl border p-5 bg-slate-900/80 backdrop-blur-md transition-colors ${
    active
      ? accentStyle.activeBorder
      : `border-slate-800/90 hover:border-slate-600/80`
  } ${isClickable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70' : ''} ${className}`;

  const content = (
    <>
      {active ? (
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${accentStyle.glow} opacity-60`}
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          {icon ? (
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                active
                  ? `${accentStyle.border} ${accentStyle.bgSoft} ${accentStyle.text}`
                  : 'border-slate-700/80 bg-slate-800/70 text-slate-300'
              }`}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-slate-50 leading-snug">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-slate-400 leading-snug">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {badge ? (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              active
                ? accentStyle.badge
                : 'border-slate-700 bg-slate-800/90 text-slate-300'
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      {children ? <div className="relative z-10 mt-3.5 text-sm text-slate-200">{children}</div> : null}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={sharedClasses}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={sharedClasses}
    >
      {content}
    </motion.div>
  );
}
