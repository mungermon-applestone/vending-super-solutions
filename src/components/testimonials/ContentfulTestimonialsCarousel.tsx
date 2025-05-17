
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';
import { transformTestimonials } from '@/hooks/cms/transformers/testimonialTransformer';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';

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

  // If no testimonials, don't render the section
  if (testimonials.length === 0) {
    return null;
  }

  const title = data.fields?.title || 'Trusted by Industry Leaders';
  const subtitle = data.fields?.subtitle || 'Hear what our clients have to say about our vending software solutions.';

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
  testimonials: Array<{
    id: string;
    name: string;
    quote: string;
    company: string;
    position: string;
    avatar?: string;
    rating?: number;
  }>;
  title: string;
  subtitle: string;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  title,
  subtitle
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        {/* Section header with consistent styling */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            {title}
          </h2>
          <p className="subtitle mx-auto">
            {subtitle}
          </p>
        </div>
        
        {/* Testimonial card with consistent styling */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl p-8 md:p-12 shadow-lg">
            {/* Quote mark decoration - position must be maintained */}
            <div className="absolute top-6 left-6 text-6xl text-vending-blue-light leading-none font-serif opacity-40">
              "
            </div>
            
            {/* Testimonial content area */}
            <div className="relative">
              {/* Star rating - maintain consistent styling */}
              <div className="flex mb-6 justify-center">
                {Array.from({ length: testimonials[activeIndex].rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
                {Array.from({ length: 5 - (testimonials[activeIndex].rating || 5) }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              
              {/* Quote text with consistent styling */}
              <blockquote className="text-xl md:text-2xl text-center font-medium text-gray-700 mb-8">
                "{testimonials[activeIndex].quote}"
              </blockquote>
              
              {/* Author information with consistent styling */}
              <div className="text-center">
                {testimonials[activeIndex].avatar && (
                  <img 
                    src={testimonials[activeIndex].avatar} 
                    alt={testimonials[activeIndex].name} 
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <div className="font-semibold text-lg">{testimonials[activeIndex].name}</div>
                <div className="text-vending-gray-dark">
                  {testimonials[activeIndex].position && testimonials[activeIndex].company ? 
                    `${testimonials[activeIndex].position}, ${testimonials[activeIndex].company}` :
                    testimonials[activeIndex].company}
                </div>
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
