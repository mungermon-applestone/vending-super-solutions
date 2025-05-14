
import React from 'react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { convertTestimonialsToSection } from '@/types/contentful/testimonial';

interface Props {
  data: ContentfulTestimonialSection | Array<any>;
}

const MachineTestimonialsSection: React.FC<Props> = ({ data }) => {
  // Check if data is an array (old format) and convert if needed
  const testimonialSection = Array.isArray(data) 
    ? convertTestimonialsToSection(data) 
    : data;
  
  // This is a simple wrapper around the main TestimonialsSection component
  return <TestimonialsSection data={testimonialSection} />;
};

export default MachineTestimonialsSection;
