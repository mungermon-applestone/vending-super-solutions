
import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import { ContactSection } from '@/components/common';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';
import ExportHeroSlidesButton from '@/components/export/ExportHeroSlidesButton';

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
      {/* Export Button - positioned above hero slider */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <ExportHeroSlidesButton sliderId="home-slider" />
        </div>
      </div>
      
      <HeroSlider sliderId="home-slider" />
      <FeaturesSection />
      <ProductTypesSection />
      <BusinessGoalsSection />
      <AvailableMachinesSection />
      
      {/* Use our new ContentfulTestimonialsCarousel component */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection} 
        isLoading={isLoading}
        error={error}
      />
      
      {/* Replace SimpleContactCTA with our new ContactSection */}
      <ContactSection 
        title="Ready to Transform Your Vending Operations?" 
        description="Get in touch and we'll start you on your vending journey."
        className="w-full"
        formType="Home Page Inquiry"
        formVariant="compact"
      />
    </>
  );
};

export default Home;
