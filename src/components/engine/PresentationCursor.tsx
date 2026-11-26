import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], .cursor-pointer';

export function PresentationCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let isPressed = false;
    let rafId = 0;

    const updateVisuals = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        ringX += (mouseX - ringX) * 0.28;
        ringY += (mouseY - ringY) * 0.28;

        const opacity = isVisible ? '1' : '0';
        const dotScale = isPressed ? 0.85 : isHovering ? 1.1 : 1;
        const ringScale = isPressed ? 0.8 : isHovering ? 1.38 : 1;

        dot.style.opacity = opacity;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;

        ring.style.opacity = opacity;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ring.style.borderColor = isHovering
          ? 'rgba(46, 100, 181, 0.85)'
          : 'rgba(27, 54, 93, 0.42)';
        ring.style.backgroundColor = isHovering
          ? 'rgba(46, 100, 181, 0.10)'
          : 'rgba(27, 54, 93, 0.04)';
      }
      rafId = window.requestAnimationFrame(updateVisuals);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!isVisible) {
        ringX = mouseX;
        ringY = mouseY;
        isVisible = true;
      }
      const target = event.target as HTMLElement | null;
      isHovering = Boolean(target?.closest(INTERACTIVE_SELECTOR));
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      ringX = mouseX;
      ringY = mouseY;
      isVisible = true;
    };

    const handleMouseDown = () => {
      isPressed = true;
    };

    const handleMouseUp = () => {
      isPressed = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = window.requestAnimationFrame(updateVisuals);

    return () => {
      root.classList.remove('custom-cursor-active');
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Subtle trailing outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border-[1.5px] opacity-0 transition-[border-color,background-color,opacity] duration-150 will-change-transform"
        style={{
          borderColor: 'rgba(27, 54, 93, 0.42)',
          backgroundColor: 'rgba(27, 54, 93, 0.04)',
        }}
      />
      {/* Crisp zero-latency center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-[#1B365D] opacity-0 shadow-[0_0_0_1.5px_rgba(255,255,255,0.92)] transition-opacity duration-150 will-change-transform"
      />
    </>
  );
}
