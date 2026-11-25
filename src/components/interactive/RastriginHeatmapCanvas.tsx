import { useEffect, useRef } from 'react';
import { rastrigin2D } from '../../utils/prng';

export interface RastriginHeatmapCanvasProps {
  size?: number;
  className?: string;
}

/**
 * Renders a static 2D thermal heatmap of Rastrigin on [-5.12, 5.12]^2
 * once on mount so SVG overlays can animate smoothly at 60 FPS on top.
 */
export function RastriginHeatmapCanvas({
  size = 320,
  className = '',
}: RastriginHeatmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = ctx.createImageData(size, size);
    const data = img.data;

    for (let py = 0; py < size; py += 1) {
      const y = -5.12 + (py / (size - 1)) * 10.24;
      for (let px = 0; px < size; px += 1) {
        const x = -5.12 + (px / (size - 1)) * 10.24;
        const val = rastrigin2D(x, y); // [0, ~80]
        const norm = Math.min(1, Math.sqrt(Math.max(0, val) / 76));

        // Subtle contour isoline highlights
        const contourMod = val % 6.5;
        const isContour = contourMod < 0.45 ? 14 : 0;

        // Smooth thermal dark palette: deep teal-navy valleys -> cobalt -> warm crimson/amber peaks
        let r: number;
        let g: number;
        let b: number;
        if (norm < 0.35) {
          const t = norm / 0.35;
          r = 6 + t * 14;
          g = 26 + t * 14;
          b = 46 + t * 52;
        } else if (norm < 0.7) {
          const t = (norm - 0.35) / 0.35;
          r = 20 + t * 68;
          g = 40 - t * 12;
          b = 98 - t * 14;
        } else {
          const t = (norm - 0.7) / 0.3;
          r = 88 + t * 92;
          g = 28 + t * 44;
          b = 84 - t * 42;
        }

        const idx = (py * size + px) * 4;
        data[idx] = Math.min(255, Math.round(r + isContour));
        data[idx + 1] = Math.min(255, Math.round(g + isContour));
        data[idx + 2] = Math.min(255, Math.round(b + isContour));
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
