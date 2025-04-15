
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

// Initialize the CMS configuration
initCMS();

const Home = () => {
  console.log('[Home] Rendering Home component');
  
  // Force refetch to ensure we get the latest data
  const { refetch } = useLandingPageByKey('home');
  
  useEffect(() => {
    // Force refetch on component mount
    refetch().catch(err => {
      console.error('Error refetching landing page data:', err);
    });
  }, [refetch]);
  
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
