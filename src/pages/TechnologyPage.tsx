
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologyGrid from '@/components/technology/TechnologyGrid';
import TechnologyFeatureSection from '@/components/technology/TechnologyFeatureSection';
import { ContactSection } from '@/components/common';
import { useContentfulTechnologyPageContent } from '@/hooks/cms/useContentfulTechnologyPageContent';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const TechnologyPage = () => {
  const { data: pageContent } = useContentfulTechnologyPageContent();
  const { data: testimonialSection, isLoading, error } = useTestimonialSection('technology');
  const navigate = useNavigate();

  return (
    <>
      <TechnologyHero />
      <TechnologyGrid />
      <TechnologyFeatureSection />
      
      {/* Testimonials Section */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Replace SimpleContactCTA with ContactSection */}
      <ContactSection 
        title={pageContent?.ctaSectionTitle || "Ready to implement our technology?"}
        description={pageContent?.ctaSectionDescription || "Get in touch with our team to learn how our technology can transform your business."}
        formType="Technology Page Inquiry"
        className="w-full"
      />
    </>
  );
};

export default TechnologyPage;
