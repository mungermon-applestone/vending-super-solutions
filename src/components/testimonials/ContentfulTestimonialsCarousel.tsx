
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';
import { transformTestimonials } from '@/hooks/cms/transformers/testimonialTransformer';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import { Testimonial } from '@/types/testimonial';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';
import TranslatableText from '@/components/translation/TranslatableText';
import TranslatedTestimonial from './TranslatedTestimonial';

interface ContentfulTestimonialsCarouselProps {
  data: ContentfulTestimonialSection | null;
  isLoading?: boolean;
  error?: Error | null;
}

const ContentfulTestimonialsCarousel: React.FC<ContentfulTestimonialsCarouselProps> = ({ 
  data, 
  isLoading,
  error
}) => {
  // Translate CMS content when available
  const { translatedContent } = useTranslatedCMSContent(data?.fields, 'testimonials-section');

  // Enhanced logging to help debug
  console.log('[ContentfulTestimonialsCarousel] Props received:', {
    hasData: !!data,
    isLoading,
    hasError: !!error,
    dataFields: data?.fields,
    testimonials: data?.fields?.testimonials?.length
  });

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              Loading testimonials...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error || !data) {
    console.error('[ContentfulTestimonialsCarousel] Error loading testimonials:', error);
    return null; // Return null to not show anything when there's an error
  }

  // Transform the Contentful testimonials to our application format
  const testimonials = data.fields?.testimonials 
    ? transformTestimonials(data.fields.testimonials)
    : [];

  console.log('[ContentfulTestimonialsCarousel] Transformed testimonials:', {
    count: testimonials.length,
    testimonials
  });

  // If no testimonials, don't render the section
  if (testimonials.length === 0) {
    console.log('[ContentfulTestimonialsCarousel] No testimonials to display, returning null');
    return null;
  }

  // Use translated CMS content if available, otherwise use translatable fallbacks
  const title = translatedContent?.title || data?.fields?.title;
  const subtitle = translatedContent?.subtitle || data?.fields?.subtitle;

  return (
    <ContentfulErrorBoundary contentType="Testimonials">
      <TestimonialsCarousel 
        testimonials={testimonials}
        title={title}
        subtitle={subtitle}
      />
    </ContentfulErrorBoundary>
  );
};

// Inner component that manages the carousel functionality
interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title: string;
  subtitle: string;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  title,
  subtitle
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Auto-cycle through testimonials
  useEffect(() => {
    if (isPaused || isAnimating) return;
    
    const interval = setInterval(() => {
      setSlideDirection('left');
      setIsAnimating(true);
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused, isAnimating]);
  
  // Handle animation completion
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, activeIndex]);
  
  const nextTestimonial = () => {
    if (isAnimating) return;
    setSlideDirection('left');
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    if (isAnimating) return;
    setSlideDirection('right');
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        {/* Section header with consistent styling */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            {title ? (
              title
            ) : (
              <TranslatableText context="testimonials-section">
                Trusted by Industry Leaders
              </TranslatableText>
            )}
          </h2>
          <p className="subtitle mx-auto">
            {subtitle ? (
              subtitle
            ) : (
              <TranslatableText context="testimonials-section">
                Hear what our clients have to say about our vending software solutions.
              </TranslatableText>
            )}
          </p>
        </div>
        
        {/* Testimonial card with consistent styling */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative bg-white rounded-xl p-8 md:p-12 shadow-lg"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Quote mark decoration - position must be maintained */}
            <div className="absolute top-6 left-6 text-6xl text-vending-blue-light leading-none font-serif opacity-40">
              "
            </div>
            
            {/* Testimonial content area with slide animation */}
            <div className="relative overflow-hidden">
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isAnimating 
                    ? slideDirection === 'left' 
                      ? '-translate-x-full opacity-0' 
                      : 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                {/* Quote text with consistent styling */}
                <TranslatedTestimonial testimonial={testimonials[activeIndex]} />
              </div>
            </div>
            
            {/* Navigation arrows - position and styling must be maintained */}
            <button 
              onClick={prevTestimonial} 
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextTestimonial} 
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Pagination dots with active indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-vending-blue scale-110' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentfulTestimonialsCarousel;
