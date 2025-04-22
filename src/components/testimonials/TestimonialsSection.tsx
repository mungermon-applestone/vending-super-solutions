
import React from 'react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

interface Props {
  data: ContentfulTestimonialSection;
}

const TestimonialsSection: React.FC<Props> = ({ data }) => {
  const testimonials = data?.testimonials || [];
  
  if (!testimonials.length) {
    return null;
  }
  
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.title || "What Our Clients Say"}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              {testimonial.rating && (
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              
              <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                {testimonial.authorImage?.url && (
                  <div className="mr-3">
                    <img 
                      src={testimonial.authorImage.url} 
                      alt={testimonial.authorName} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{testimonial.authorName}</p>
                  {testimonial.authorTitle && (
                    <p className="text-sm text-gray-500">{testimonial.authorTitle}</p>
                  )}
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
