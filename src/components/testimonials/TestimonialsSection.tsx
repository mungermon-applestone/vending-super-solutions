
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

interface TestimonialsSectionProps {
  data: ContentfulTestimonialSection;
}

// Type guard to check if a testimonial is in Contentful format
const isContentfulTestimonial = (testimonial: any): boolean => {
  return testimonial && typeof testimonial === 'object' && testimonial.fields !== undefined;
};

export const TestimonialsSection = ({ data }: TestimonialsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle both new and legacy formats
  const testimonials = data.fields?.testimonials || data.testimonials || [];

  if (!testimonials.length) {
    return null;
  }

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // We need to handle both Contentful and CMS formats
  const currentTestimonial = testimonials[activeIndex];
  if (!currentTestimonial) return null;

  // Get section title and subtitle from either format
  const title = data.fields?.title || data.title || "Trusted by Industry Leaders";
  const subtitle = data.fields?.subtitle || data.subtitle || "Hear what our clients have to say about our solutions";

  // Helper function to extract testimonial data regardless of format
  const getTestimonialData = () => {
    // Check if it's in Contentful format with fields property
    if (isContentfulTestimonial(currentTestimonial)) {
      return {
        quote: currentTestimonial.fields.quote || '',
        author: currentTestimonial.fields.author || '',
        position: currentTestimonial.fields.position || '',
        company: currentTestimonial.fields.company || '',
        rating: currentTestimonial.fields.rating || 5,
        image: currentTestimonial.fields.image
      };
    }
    
    // It's in the CMS format with direct properties
    return {
      quote: currentTestimonial.testimonial || '',
      author: currentTestimonial.name || '',
      position: currentTestimonial.title || '',
      company: currentTestimonial.company || '',
      rating: currentTestimonial.rating || 5,
      image: currentTestimonial.image_url ? { 
        fields: { 
          file: { url: currentTestimonial.image_url },
          title: currentTestimonial.name || '' 
        } 
      } : null
    };
  };

  const testimonialData = getTestimonialData();

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            {title}
          </h2>
          <p className="subtitle mx-auto text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <div className="absolute top-6 left-6 text-6xl text-vending-blue-light leading-none font-serif opacity-40">
              "
            </div>

            <div className="relative">
              {/* Stars */}
              {testimonialData.rating && (
                <div className="flex mb-6 justify-center">
                  {[...Array(testimonialData.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                  {[...Array(5 - (testimonialData.rating || 0))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-center font-medium text-gray-700 mb-8">
                "{testimonialData.quote}"
              </blockquote>

              {/* Author info */}
              <div className="text-center">
                {testimonialData.image?.fields?.file?.url && (
                  <img 
                    src={`https:${testimonialData.image.fields.file.url}`}
                    alt={testimonialData.image.fields.title || testimonialData.author}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <div className="font-semibold text-lg">{testimonialData.author}</div>
                <div className="text-vending-gray-dark">
                  {testimonialData.position}
                  {testimonialData.position && testimonialData.company && ', '}
                  {testimonialData.company}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            {testimonials.length > 1 && (
              <>
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

                {/* Pagination dots */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
