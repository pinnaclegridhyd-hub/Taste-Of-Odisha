import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

/**
 * useHeroCarousel
 * ---------------
 * Encapsulates Embla Carousel initialisation, the Autoplay plugin,
 * active-slide tracking, and navigation helpers (arrows, dots, keyboard).
 *
 * Autoplay config:
 *  - delay: 5000ms between slides
 *  - stopOnInteraction: false  → autoplay resumes after user drags/clicks
 *  - stopOnMouseEnter: true    → pauses while cursor hovers the carousel
 *
 * Loop is enabled so the carousel wraps around seamlessly.
 */
export function useHeroCarousel() {
  // --- Embla instance with Autoplay plugin ---
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false, // resume after drag/click
        stopOnMouseEnter: true,   // pause on hover
      }),
    ],
  );

  // --- State: which slide is active + total dot positions ---
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // --- Callbacks for arrows ---
  const onPrevClick = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextClick = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // --- Callback for dot indicators ---
  const onDotClick = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  // --- Keyboard handler (left/right arrow keys) ---
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevClick();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNextClick();
      }
    },
    [onPrevClick, onNextClick],
  );

  // --- Sync selected index when Embla settles on a new slide ---
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(); // set initial value

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  return {
    emblaRef,
    selectedIndex,
    scrollSnaps,
    onPrevClick,
    onNextClick,
    onDotClick,
    onKeyDown,
  };
}
