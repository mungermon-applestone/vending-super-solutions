
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import MachineTypesSection from '@/components/home/MachineTypesSection';
import { SimpleContactCTA } from '@/components/common';
import ContentfulDebug from '@/components/debug/ContentfulDebug';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const Home = () => {
  console.log('[Home] CMS Configuration status:', {
    isConfigured: isContentfulConfigured(),
    spaceId: CONTENTFUL_CONFIG.SPACE_ID || 'NOT SET',
    hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    tokenLength: CONTENTFUL_CONFIG.DELIVERY_TOKEN?.length || 0,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });

  // Fetch testimonials from Contentful with the 'home' pageKey
  const { data: testimonialSection, isLoading, error } = useTestimonialSection('home');

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductTypesSection />
      <MachineTypesSection />
      <BusinessGoalsSection />
      
      {/* Use our new ContentfulTestimonialsCarousel component */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection} 
        isLoading={isLoading}
        error={error}
      />
      
      <SimpleContactCTA 
        title="Ready to Transform Your Vending Operations?" 
        description="Get in touch and we'll start you on your vending journey."
        className="w-full"
        formType="Home Page Inquiry"
        primaryButtonText="Get Started Today"
      />
      <ContentfulDebug />
    </>
  );
};

export default Home;
