
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/common/PageHero';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import MachineTypesSection from '@/components/home/MachineTypesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/common/CTASection';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { initCMS } from '@/services/cms/cmsInit';

// Initialize the CMS configuration
initCMS();

const Index = () => {
  // Explicit key for the home page hero content
  const { refetch } = useLandingPageByKey('home');

  useEffect(() => {
    // Force refetch to ensure the latest data from Supabase
    refetch().catch(err => {
      console.error('Error refetching landing page data:', err);
    });
  }, [refetch]);

  return (
    <Layout>
      <PageHero 
        pageKey="home"
        fallbackTitle="Vend Anything You Sell"
        fallbackSubtitle="Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue."
        fallbackImage="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
        fallbackImageAlt="Vending Machine Software Interface"
        fallbackPrimaryButtonText="Request a Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="Explore Solutions"
        fallbackSecondaryButtonUrl="/products"
      />
      <FeaturesSection />
      <ProductTypesSection />
      <MachineTypesSection />
      <BusinessGoalsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
