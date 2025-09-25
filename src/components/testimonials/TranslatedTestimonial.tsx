import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types/testimonial';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';

interface TranslatedTestimonialProps {
  testimonial: Testimonial;
}

/**
 * TranslatedTestimonial Component
 * 
 * Renders a single testimonial with translation support for quote, name, position, and company
 */
const TranslatedTestimonial: React.FC<TranslatedTestimonialProps> = ({ testimonial }) => {
  const { translatedContent } = useTranslatedCMSContent(testimonial, 'testimonial');
  
  // Use translated content if available, otherwise use original
  const displayQuote = translatedContent?.quote || testimonial.quote;
  const displayName = translatedContent?.name || testimonial.name;
  const displayPosition = translatedContent?.position || testimonial.position;
  const displayCompany = translatedContent?.company || testimonial.company;

  return (
    <>
      {/* Star rating - maintain consistent styling */}
      <div className="flex mb-6 justify-center">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
        {Array.from({ length: 5 - (testimonial.rating || 5) }).map((_, i) => (
          <Star key={i} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
      
      {/* Quote text with consistent styling */}
      <blockquote className="text-xl md:text-2xl text-center font-medium text-gray-700 mb-8">
        "{displayQuote}"
      </blockquote>
      
      {/* Author information with consistent styling */}
      <div className="text-center">
        {testimonial.avatar && (
          <img 
            src={testimonial.avatar} 
            alt={displayName} 
            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <div className="font-semibold text-lg">{displayName}</div>
        <div className="text-vending-gray-dark">
          {displayPosition && displayCompany ? 
            `${displayPosition}, ${displayCompany}` :
            displayCompany}
        </div>
      </div>
    </>
  );
};

export default TranslatedTestimonial;