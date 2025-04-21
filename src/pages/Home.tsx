
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import MachineTypesSection from '@/components/home/MachineTypesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/common/CTASection';
import { initCMS } from '@/services/cms/cmsInit';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { useHomePageContent } from '@/hooks/useHomePageContent';

// Initialize the CMS configuration
initCMS();

const Home = () => {
  console.log('[Home] Rendering Home component');
  
  // Force refetch to ensure we get the latest data
  const { refetch: refetchLandingPage } = useLandingPageByKey('home');
  const { data: homePageContent, refetch: refetchHomeContent } = useHomePageContent();
  
  useEffect(() => {
    // Force refetch on component mount
    refetchLandingPage().catch(err => {
      console.error('Error refetching landing page data:', err);
    });
    
    refetchHomeContent().catch(err => {
      console.error('Error refetching home page content:', err);
    });
    
    // Log Contentful space ID to verify configuration
    console.log('Contentful Space ID:', import.meta.env.VITE_CONTENTFUL_SPACE_ID);
  }, [refetchLandingPage, refetchHomeContent]);
  
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ProductTypesSection />
      <MachineTypesSection />
      <BusinessGoalsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Home;
