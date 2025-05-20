
import React from 'react';
import MachinesHero from '@/components/machines/MachinesHero';
import MachineGrid from '@/components/machines/MachineGrid';
import MachinesIntroSection from '@/components/machines/MachinesIntroSection';
import { ContactSection } from '@/components/common';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const MachinesPage = () => {
  const { data: pageContent } = useMachinesPageContent();
  const { data: testimonialSection, isLoading, error } = useTestimonialSection('machines');

  return (
    <>
      <MachinesHero />
      <MachinesIntroSection />
      <MachineGrid />
      
      {/* Testimonials Section */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Replace SimpleContactCTA with ContactSection */}
      <ContactSection 
        title={pageContent?.ctaSectionTitle || "Ready to find the right machine for your business?"}
        description={pageContent?.ctaSectionDescription || "Contact us to discuss your vending machine needs and get personalized recommendations."}
        formType="Machines Page Inquiry"
        className="w-full"
      />
    </>
  );
};

export default MachinesPage;
