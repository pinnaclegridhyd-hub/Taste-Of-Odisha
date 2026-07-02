'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  _id: string;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function HeroCarousel() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data.success && data.data) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error('Failed to load banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  // Auto-play effect
  useEffect(() => {
    if (loading || banners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [banners, isHovered, loading]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipe = 50;

    if (diff > minSwipe) {
      nextSlide();
    } else if (diff < -minSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) {
    // Shimmer effect placeholder matching the aspect ratio
    return (
      <div className="w-full relative overflow-hidden bg-heritage-bone aspect-[16/9] md:aspect-[21/9] rounded-xl border border-heritage-dark/5 animate-pulse">
        <div className="w-full h-full bg-heritage-dark/5 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Fallback: If no banners are set, return null (hide gracefully)
  if (banners.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full relative overflow-hidden bg-heritage-bone aspect-[16/9] md:aspect-[21/9] rounded-xl border border-heritage-dark/5 shadow-sm group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="w-full h-full relative">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % banners.length;
          
          // Render as a clickable link if linkUrl is present, otherwise static block
           const slideContent = (
            <div className="relative w-full h-full">
              {/* Main Banner Image (Clean, edge-to-edge, no scale, no cropping boundaries) */}
              <Image
                src={banner.imageUrl}
                alt={banner.title || 'Taste of Odisha Banner'}
                fill
                priority={isActive || isNext}
                loading={isActive || isNext ? undefined : 'lazy'}
                className="object-cover object-center transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />
            </div>
          );

          return (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {banner.linkUrl ? (
                <Link href={banner.linkUrl} className="block w-full h-full">
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls (Positioned just inside, attached to banner) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators Dots (Only if there is more than 1 banner) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-primary'
                  : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
