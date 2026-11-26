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

  const sharedClasses = `relative w-full text-left rounded-2xl border p-5 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur-md transition-colors ${
    active
      ? accentStyle.activeBorder
      : `border-slate-200 hover:border-slate-300`
  } ${isClickable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/60' : ''} ${className}`;

  const content = (
    <>
      {active ? (
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${accentStyle.glow} opacity-80`}
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
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 leading-snug">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-slate-600 leading-snug">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {badge ? (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              active
                ? accentStyle.badge
                : 'border-slate-200 bg-slate-100 text-slate-700'
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      {children ? <div className="relative z-10 mt-3.5 text-sm text-slate-700">{children}</div> : null}
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
