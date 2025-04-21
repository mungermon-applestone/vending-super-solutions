
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
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

// Initialize the CMS configuration 
initCMS();

const Home = () => {
  console.log('[Home] Rendering Home component');
  
  // Force refetch to ensure we get the latest data
  const { refetch: refetchLandingPage } = useLandingPageByKey('home');
  const { data: homePageContent, refetch: refetchHomeContent, error } = useHomePageContent();
  
  useEffect(() => {
    // Force-refresh the Contentful client on component mount
    const refreshClient = async () => {
      try {
        console.log('[Home] Refreshing Contentful client');
        await refreshContentfulClient();
        
        // Test Contentful connection
        const client = await getContentfulClient();
        console.log('[Home] Contentful client created successfully:', !!client);
        
        if (client) {
          // Make a test query to verify connection works
          const testQuery = await client.getEntries({
            limit: 1,
          });
          console.log('[Home] Contentful test query successful, total entries:', testQuery.total);
        }
      } catch (err) {
        console.error('[Home] Error refreshing Contentful client:', err);
      }
    };
    
    refreshClient();
    
    // Force refetch on component mount
    refetchLandingPage().catch(err => {
      console.error('Error refetching landing page data:', err);
    });
    
    refetchHomeContent().catch(err => {
      console.error('Error refetching home page content:', err);
    });
    
    // Log Contentful space ID to verify configuration
    console.log('Contentful Space ID:', import.meta.env.VITE_CONTENTFUL_SPACE_ID);
    console.log('Contentful Environment ID:', import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID);
    console.log('Has Contentful Delivery Token:', !!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN);
    
    // Show toast warning if Contentful is not properly configured
    if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || import.meta.env.VITE_CONTENTFUL_SPACE_ID === '') {
      toast.warning('Contentful Space ID is missing. Check your environment variables.', {
        duration: 5000,
        id: 'contentful-warning-spaceid',
      });
    }
    
    if (!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN && !import.meta.env.CONTENTFUL_DELIVERY_TOKEN) {
      toast.warning('Contentful Delivery Token is missing. Check your environment variables.', {
        duration: 5000,
        id: 'contentful-warning-token',
      });
    }
  }, [refetchLandingPage, refetchHomeContent]);
  
  // Log home page content for debugging
  useEffect(() => {
    console.log('[Home] Home page content:', homePageContent);
    if (error) {
      console.error('[Home] Error fetching home page content:', error);
    }
  }, [homePageContent, error]);
  
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
