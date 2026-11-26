import { useEffect, useRef } from 'react';

export interface SlideKeyboardOptions {
  /** ArrowDown — advance to next state/card in current slide */
  onNextState?: () => void;
  /** ArrowUp — move to previous state/card in current slide */
  onPrevState?: () => void;
  /** Keys '1'..'9' — jump directly to state index 0..8 */
  onSelectNumber?: (index: number) => void;
  /** Enter — run primary demo action (sample, recombine, mutate, play/pause) */
  onAction?: () => void;
  /** Key 'v' / 'V' — toggle secondary literature/mode view */
  onToggleView?: () => void;
  /** Additional single-letter keys (lowercase), e.g. 'r' reset, 'z' zoom */
  onKey?: (lowerKey: string) => void;
}

export function useSlideKeyboard(options: SlideKeyboardOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // Do not intercept while a modal dialog (Index or Shortcuts Legend) is open
      if (document.querySelector('[aria-modal="true"]')) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      const opts = optionsRef.current;

      if (event.key === 'ArrowDown' && opts.onNextState) {
        event.preventDefault();
        opts.onNextState();
        return;
      }

      if (event.key === 'ArrowUp' && opts.onPrevState) {
        event.preventDefault();
        opts.onPrevState();
        return;
      }

      if (opts.onSelectNumber && /^[1-9]$/.test(event.key)) {
        event.preventDefault();
        opts.onSelectNumber(Number(event.key) - 1);
        return;
      }

      if (event.key === 'Enter' && opts.onAction) {
        // Avoid double-triggering if user explicitly focused a button/link
        if (target && target.closest('button, a, [role="button"]')) {
          return;
        }
        event.preventDefault();
        opts.onAction();
        return;
      }

      const lower = event.key.toLowerCase();
      if (lower === 'v' && opts.onToggleView) {
        event.preventDefault();
        opts.onToggleView();
        return;
      }

      if (opts.onKey && lower.length === 1) {
        opts.onKey(lower);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
