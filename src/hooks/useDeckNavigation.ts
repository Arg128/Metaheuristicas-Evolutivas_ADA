import { useCallback, useEffect, useState } from 'react';

export interface DeckNavigationState {
  currentIndex: number;
  direction: 1 | -1;
  isIndexOpen: boolean;
  isNotesOpen: boolean;
  isFullscreen: boolean;
  goNext: () => void;
  goPrev: () => void;
  goToSlide: (index: number) => void;
  toggleIndex: () => void;
  toggleNotes: () => void;
  toggleFullscreen: () => void;
  closeOverlays: () => void;
}

export function useDeckNavigation(totalSlides: number): DeckNavigationState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(totalSlides - 1, index)),
    [totalSlides],
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      setCurrentIndex((prev) => {
        const next = clampIndex(targetIndex);
        if (next === prev) return prev;
        setDirection(next > prev ? 1 : -1);
        return next;
      });
    },
    [clampIndex],
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= totalSlides - 1) return prev;
      setDirection(1);
      return prev + 1;
    });
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      setDirection(-1);
      return prev - 1;
    });
  }, []);

  const toggleIndex = useCallback(() => {
    setIsIndexOpen((prev) => !prev);
  }, []);

  const toggleNotes = useCallback(() => {
    setIsNotesOpen((prev) => !prev);
  }, []);

  const closeOverlays = useCallback(() => {
    setIsIndexOpen(false);
    setIsNotesOpen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        void document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        void document.exitFullscreen?.().catch(() => {});
      }
    } catch {
      // Fullscreen API unavailable or blocked by browser policy
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      const isSpace = event.key === ' ' || event.code === 'Space';
      if (isSpace && target && target.closest('button, a, [role="button"]')) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          goNext();
          break;
        case ' ':
          event.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          goPrev();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          toggleNotes();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          toggleIndex();
          break;
        case 'Escape':
          closeOverlays();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    closeOverlays,
    goNext,
    goPrev,
    goToSlide,
    toggleFullscreen,
    toggleIndex,
    toggleNotes,
    totalSlides,
  ]);

  return {
    currentIndex,
    direction,
    isIndexOpen,
    isNotesOpen,
    isFullscreen,
    goNext,
    goPrev,
    goToSlide,
    toggleIndex,
    toggleNotes,
    toggleFullscreen,
    closeOverlays,
  };
}
