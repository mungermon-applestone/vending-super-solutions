
import React from 'react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';

interface Props {
  data: ContentfulTestimonialSection;
}

const MachineTestimonialsSection: React.FC<Props> = ({ data }) => {
  // This is a simple wrapper around the main TestimonialsSection component
  return <TestimonialsSection data={data} />;
};

export default MachineTestimonialsSection;
