import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDeckNavigation } from '../../hooks/useDeckNavigation';
import { useViewportScale } from '../../hooks/useViewportScale';
import type { SlideMeta } from '../../types/presentation';
import { BottomControls } from './BottomControls';
import { PresenterNotesModal } from './PresenterNotesModal';
import { SlideIndexMenu } from './SlideIndexMenu';
import { TopProgressBar } from './TopProgressBar';

export interface DeckShellProps {
  slides: SlideMeta[];
  renderSlide: (slide: SlideMeta, index: number, totalSlides: number) => ReactNode;
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.99,
  }),
};

export function DeckShell({ slides, renderSlide }: DeckShellProps) {
  const totalSlides = slides.length;
  const nav = useDeckNavigation(totalSlides);
  const { scale, width, height } = useViewportScale();
  const currentSlide = slides[nav.currentIndex] ?? slides[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050816] text-slate-50 select-none">
      {/* Ambient Radial + Subtle Grid SVG Backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute -bottom-48 right-1/5 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[140px]" />
        <svg className="h-full w-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="deck-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deck-grid)" />
        </svg>
      </div>

      {/* Top HUD & Progress Bar */}
      <TopProgressBar
        currentSlide={currentSlide}
        currentIndex={nav.currentIndex}
        totalSlides={totalSlides}
        isIndexOpen={nav.isIndexOpen}
        isNotesOpen={nav.isNotesOpen}
        isFullscreen={nav.isFullscreen}
        onToggleIndex={nav.toggleIndex}
        onToggleNotes={nav.toggleNotes}
        onToggleFullscreen={nav.toggleFullscreen}
      />

      {/* Centered 1600x900 Scaled Presentation Stage */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="relative shrink-0 overflow-hidden"
        >
          <AnimatePresence mode="wait" custom={nav.direction}>
            <motion.div
              key={currentSlide.id}
              custom={nav.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              {renderSlide(currentSlide, nav.currentIndex, totalSlides)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Floating Navigation Controls */}
      <BottomControls
        currentIndex={nav.currentIndex}
        totalSlides={totalSlides}
        onPrev={nav.goPrev}
        onNext={nav.goNext}
      />

      {/* Slide Index Modal */}
      <SlideIndexMenu
        isOpen={nav.isIndexOpen}
        slides={slides}
        currentIndex={nav.currentIndex}
        onSelectSlide={nav.goToSlide}
        onClose={nav.closeOverlays}
      />

      {/* Presenter Notes Drawer */}
      <PresenterNotesModal
        isOpen={nav.isNotesOpen}
        slide={currentSlide}
        totalSlides={totalSlides}
        onClose={nav.closeOverlays}
      />
    </div>
  );
}
