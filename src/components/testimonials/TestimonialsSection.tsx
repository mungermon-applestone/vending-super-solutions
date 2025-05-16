
import React from 'react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

interface TestimonialProps {
  data: ContentfulTestimonialSection;
}

const TestimonialsSection: React.FC<TestimonialProps> = ({ data }) => {
  // Handle empty or missing data
  if (!data || !data.fields) {
    return null;
  }
  
  // Extract testimonials from data or use empty array if not present
  const testimonials = data.fields?.testimonials || [];
  
  // Skip rendering if no testimonials are available
  if (testimonials.length === 0) {
    return null;
  }
  
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.fields?.title || 'What Our Clients Say'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {data.fields?.subtitle || 'Hear from our satisfied customers about their experience with our solutions.'}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.sys.id} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              {/* Testimonial content */}
              <div className="mb-4">
                <p className="text-gray-600 italic">"{testimonial.fields?.quote || ''}"</p>
              </div>
              
              {/* Author info */}
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">{testimonial.fields?.author || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.fields?.position && testimonial.fields?.company 
                      ? `${testimonial.fields.position}, ${testimonial.fields.company}`
                      : testimonial.fields?.company || testimonial.fields?.position || ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
