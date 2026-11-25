import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { SemanticAccent } from '../../types/presentation';
import { getAccentStyle } from '../../utils/accentStyles';
import { MathFormula } from './MathFormula';

export interface ParameterSliderProps {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  accent?: SemanticAccent;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
}

export function ParameterSlider({
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit = '',
  accent = 'cyan',
  disabled = false,
  formatValue,
  onChange,
}: ParameterSliderProps) {
  const inputId = useId();
  const accentStyle = getAccentStyle(accent);
  const safeRange = max - min > 0 ? max - min : 1;
  const percent = Math.max(0, Math.min(100, ((value - min) / safeRange) * 100));
  const displayValue = formatValue ? formatValue(value) : String(value);

  const sliderStyle = {
    '--slider-accent': accentStyle.hex,
  } as CSSProperties;

  return (
    <div className="rounded-xl border border-slate-800/90 bg-slate-900/75 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-sm font-medium text-slate-200"
        >
          <span>{label}</span>
          {symbol ? (
            <span className={`text-xs ${accentStyle.text}`}>
              (<MathFormula tex={symbol} />)
            </span>
          ) : null}
        </label>
        <div
          className={`rounded-md border px-2.5 py-0.5 font-mono text-sm font-semibold tabular-nums ${accentStyle.badge}`}
        >
          {displayValue}
          {unit ? <span className="ml-1 text-xs opacity-85">{unit}</span> : null}
        </div>
      </div>

      <div className="relative flex h-6 items-center">
        <div className="pointer-events-none absolute inset-x-0 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full ${accentStyle.trackBg} transition-[width] duration-75`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          style={sliderStyle}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.stopPropagation()}
          className="meta-slider relative z-10 w-full"
        />
      </div>

      <div className="mt-1 flex justify-between font-mono text-[11px] tabular-nums text-slate-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
