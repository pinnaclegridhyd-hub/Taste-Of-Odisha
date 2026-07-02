'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useHeroCarousel } from '@/hooks/useHeroCarousel';
import { heroSlides } from './heroSlides';

/**
 * HeroCarousel
 * ------------
 * Full-width, auto-sliding, swipeable hero carousel powered by Embla.
 *
 * Features:
 *  • Autoplay (5s), pauses on hover/touch, resumes after interaction
 *  • Infinite loop with smooth translateX transitions
 *  • Left/right arrow nav, dot indicators, keyboard (←/→) support
 *  • Fully responsive: 520px desktop → 400px tablet → 380px mobile
 *  • First slide image prioritized for LCP; others lazy-loaded
 *  • Fixed heights per breakpoint to prevent layout shift
 *  • Accessible: aria-labels on all controls, role="region"
 */
export default function HeroCarousel() {
  const {
    emblaRef,
    selectedIndex,
    scrollSnaps,
    onPrevClick,
    onNextClick,
    onDotClick,
    onKeyDown,
  } = useHeroCarousel();

  if (heroSlides.length === 0) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg group"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero banner carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* ── Embla viewport ── */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 h-[380px] md:h-[400px] lg:h-[520px]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${heroSlides.length}: ${slide.heading}`}
            >
              {/* ── Background image ── */}
              <Image
                src={
                  typeof window !== 'undefined' &&
                  window.innerWidth < 768 &&
                  slide.mobileImage
                    ? slide.mobileImage
                    : slide.image
                }
                alt={`${slide.heading} ${slide.highlightText}`}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
              />

              {/* ── Gradient overlay for text readability ── */}
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-dark/85 via-heritage-dark/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/60 via-transparent to-transparent" />

              {/* ── Text content block ── */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-sanctuary w-full">
                  <div className="max-w-full md:max-w-[60%] lg:max-w-[45%] space-y-4 md:space-y-5 lg:space-y-6 pl-2 md:pl-0">
                    {/* Eyebrow label */}
                    <span className="inline-block text-[10px] md:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-heritage-gold/90">
                      {slide.eyebrowText}
                    </span>

                    {/* Heading */}
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
                      {slide.heading}
                      <br />
                      <span className="italic font-normal text-heritage-gold">
                        {slide.highlightText}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-sm md:text-base text-white/75 leading-relaxed line-clamp-3 md:line-clamp-none">
                      {slide.description}
                    </p>

                    {/* CTA button */}
                    <div className="pt-1 md:pt-2">
                      <Link
                        href={slide.ctaHref}
                        className="btn-primary inline-flex items-center gap-3 group/cta w-full sm:w-auto justify-center sm:justify-start"
                      >
                        {slide.ctaLabel}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Optional badge ── */}
              {slide.badgeText && (
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
                  <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[9px] md:text-[10px] font-sans font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {slide.badgeText}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {heroSlides.length > 1 && (
        <>
          {/* Previous */}
          <button
            onClick={onPrevClick}
            className="
              absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20
              w-9 h-9 md:w-11 md:h-11 rounded-full
              bg-black/30 hover:bg-black/60 backdrop-blur-sm
              text-white shadow-md
              flex items-center justify-center
              transition-all duration-200
              md:opacity-0 md:group-hover:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Next */}
          <button
            onClick={onNextClick}
            className="
              absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20
              w-9 h-9 md:w-11 md:h-11 rounded-full
              bg-black/30 hover:bg-black/60 backdrop-blur-sm
              text-white shadow-md
              flex items-center justify-center
              transition-all duration-200
              md:opacity-0 md:group-hover:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {scrollSnaps.length > 1 && (
        <div className="absolute bottom-4 md:bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`
                h-2.5 rounded-full transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-transparent
                ${
                  index === selectedIndex
                    ? 'w-8 bg-primary shadow-sm'
                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
