
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

interface TestimonialsSectionProps {
  data: ContentfulTestimonialSection;
}

export const TestimonialsSection = ({ data }: TestimonialsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const fields = data?.fields || {};
  const testimonialsData = fields?.testimonials?.filter(t => t.fields?.visible !== false) || [];

  if (!testimonialsData.length) {
    return null;
  }

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const currentTestimonial = testimonialsData[activeIndex]?.fields;
  if (!currentTestimonial) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            {fields?.title || "Trusted by Industry Leaders"}
          </h2>
          <p className="subtitle mx-auto text-gray-600">
            {fields?.subtitle || "Hear what our clients have to say about our solutions"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <div className="absolute top-6 left-6 text-6xl text-vending-blue-light leading-none font-serif opacity-40">
              "
            </div>

            <div className="relative">
              {/* Stars */}
              {currentTestimonial.rating && (
                <div className="flex mb-6 justify-center">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                  {[...Array(5 - (currentTestimonial.rating || 0))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-center font-medium text-gray-700 mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="text-center">
                {currentTestimonial.image?.fields?.file?.url && (
                  <img 
                    src={`https:${currentTestimonial.image.fields.file.url}`}
                    alt={currentTestimonial.image.fields.title || currentTestimonial.author}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <div className="font-semibold text-lg">{currentTestimonial.author}</div>
                <div className="text-vending-gray-dark">
                  {currentTestimonial.position}
                  {currentTestimonial.position && currentTestimonial.company && ', '}
                  {currentTestimonial.company}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            {testimonialsData.length > 1 && (
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
                  {testimonialsData.map((_, index) => (
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
