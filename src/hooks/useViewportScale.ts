import { useEffect, useState } from 'react';

export interface ViewportScale {
  scale: number;
  width: number;
  height: number;
}

const REFERENCE_WIDTH = 1600;
const REFERENCE_HEIGHT = 900;

function computeScale(): number {
  if (typeof window === 'undefined') return 1;
  const scaleX = window.innerWidth / REFERENCE_WIDTH;
  const scaleY = window.innerHeight / REFERENCE_HEIGHT;
  return Math.max(0.1, Math.min(scaleX, scaleY));
}

export function useViewportScale(): ViewportScale {
  const [scale, setScale] = useState<number>(computeScale);

  useEffect(() => {
    const handleResize = () => {
      setScale(computeScale());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    scale,
    width: REFERENCE_WIDTH,
    height: REFERENCE_HEIGHT,
  };
}
