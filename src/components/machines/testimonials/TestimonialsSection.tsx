
import React from 'react';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { convertTestimonialsToSection } from '@/types/contentful/testimonial';
import { CMSTestimonial } from '@/types/cms';

interface Props {
  data: ContentfulTestimonialSection | Array<any>;
}

const MachineTestimonialsSection: React.FC<Props> = ({ data }) => {
  let testimonialSection: ContentfulTestimonialSection;
  
  // Handle array input (old format)
  if (Array.isArray(data)) {
    // Transform to CMSTestimonial array
    const testimonials: CMSTestimonial[] = data.map(item => ({
      id: item.id || item._id || `testimonial-${Math.random().toString(36).substring(7)}`,
      name: item.name || item.author || "Customer",
      title: item.title || item.position || "",
      company: item.company || item.organization || "",
      testimonial: item.testimonial || item.content || item.text || "",
      rating: item.rating || 5,
      image_url: item.image_url || item.imageUrl || (
        item.image?.url || 
        (item.image?.fields?.file?.url && `https:${item.image.fields.file.url}`) || 
        ""
      )
    }));
    
    testimonialSection = convertTestimonialsToSection(testimonials);
  } 
  // Already in ContentfulTestimonialSection format
  else {
    testimonialSection = data;
  }
  
  // This is a simple wrapper around the main TestimonialsSection component
  return <TestimonialsSection data={testimonialSection} />;
};

export default MachineTestimonialsSection;
