
import React from 'react';
import { Testimonial } from '@/types/testimonial';

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "What Our Clients Say",
  subtitle = "Read testimonials from businesses that have partnered with us",
  testimonials = []
}) => {
  // If there are no testimonials, don't render the section
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                {testimonial.avatar && (
                  <img 
                    src={testimonial.avatar} 
                    alt={`${testimonial.name}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                )}
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  {testimonial.position && testimonial.company && (
                    <p className="text-sm text-gray-500">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-600">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
