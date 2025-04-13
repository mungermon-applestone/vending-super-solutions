
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
import { initMockLandingPagesData } from '@/services/cms/initMockData';

const Index = () => {
  // Force initialization of mock data on component mount
  useEffect(() => {
    console.log('Index page mounted - forcing mock data initialization');
    if (typeof window !== 'undefined') {
      initMockLandingPagesData();
    }
  }, []);

  // Fetch hero content from CMS for the home page
  const { data: landingPage, isLoading, error, refetch } = useLandingPageByKey('home');

  useEffect(() => {
    console.log('Index page - Landing page data:', landingPage);
    console.log('Index page - Landing page loading:', isLoading);
    console.log('Index page - Landing page error:', error);
    
    // Force refetch on mount
    refetch().catch(err => {
      console.error('Error refetching landing page data:', err);
    });
  }, [landingPage, isLoading, error, refetch]);

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
