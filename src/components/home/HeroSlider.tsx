
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useHeroSlides } from '@/hooks/cms/useHeroSlides';
import HeroSlide from './HeroSlide';

interface HeroSliderProps {
  sliderId?: string;
  autoplayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  sliderId = 'home-slider',
  autoplayInterval = 5000,
  showNavigation = true,
  showIndicators = true
}) => {
  const { data: slides, isLoading, error } = useHeroSlides(sliderId);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Effect to update current index when carousel changes
  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    
    // Initial call to set the first slide
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Handle autoplay functionality
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    
    autoplayRef.current = setInterval(() => {
      if (!isPaused && api) {
        const nextIndex = (currentIndex + 1) % (slides?.length || 1);
        api.scrollTo(nextIndex);
      }
    }, autoplayInterval);
  }, [api, currentIndex, isPaused, slides?.length, autoplayInterval]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Set up autoplay when component mounts
  useEffect(() => {
    if (slides && slides.length > 1) {
      startAutoplay();
    }
    
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay, slides]);

  // Manually navigate to a specific slide
  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!api) return;
      
      if (event.key === 'ArrowLeft') {
        api.scrollPrev();
      } else if (event.key === 'ArrowRight') {
        api.scrollNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
              </div>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="w-full h-80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !slides || slides.length === 0) {
    console.error('[HeroSlider] Error loading slides:', error);
    // Fallback to the original HeroSection
    return (
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide py-16 md:py-24">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-vending-blue-dark">Vend Anything You Sell</h1>
            <p className="mt-4 text-xl text-gray-700">
              Seamlessly integrate multiple vending machines with our advanced software solution.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="hero-slider-container relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        className="relative"
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <HeroSlide slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showNavigation && slides.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10" />
          </>
        )}
      </Carousel>
      
      {/* Slide indicators - Repositioned to be directly under the carousel */}
      {showIndicators && slides.length > 1 && (
        <div className="flex justify-center mt-4 mb-6 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-vending-blue w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
