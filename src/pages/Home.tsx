
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
import { toast } from 'sonner';

// Initialize the CMS configuration 
initCMS();

const Home = () => {
  console.log('[Home] Rendering Home component');
  
  // Force refetch to ensure we get the latest data
  const { refetch: refetchLandingPage } = useLandingPageByKey('home');
  const { data: homePageContent, refetch: refetchHomeContent, error } = useHomePageContent();
  
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
    
    // Show toast warning if Contentful is not properly configured
    if (import.meta.env.VITE_CONTENTFUL_SPACE_ID === undefined || 
        import.meta.env.VITE_CONTENTFUL_SPACE_ID === '') {
      toast.warning('Contentful is not configured. Using fallback content instead.', {
        duration: 5000,
        id: 'contentful-warning',
      });
    }
  }, [refetchLandingPage, refetchHomeContent]);
  
  // Log home page content for debugging
  useEffect(() => {
    console.log('[Home] Home page content:', homePageContent);
  }, [homePageContent]);
  
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
