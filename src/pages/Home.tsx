
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import MachineTypesSection from '@/components/home/MachineTypesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { SimpleContactCTA } from '@/components/common';
import ContentfulDebug from '@/components/debug/ContentfulDebug';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';

const Home = () => {
  console.log('[Home] CMS Configuration status:', {
    isConfigured: isContentfulConfigured(),
    spaceId: CONTENTFUL_CONFIG.SPACE_ID || 'NOT SET',
    hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    tokenLength: CONTENTFUL_CONFIG.DELIVERY_TOKEN?.length || 0,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ProductTypesSection />
      <MachineTypesSection />
      <BusinessGoalsSection />
      <TestimonialsSection />
      <SimpleContactCTA 
        title="Ready to Transform Your Vending Operations?" 
        description="Get in touch and we'll start you on your vending journey."
        className="w-full"
      />
      <ContentfulDebug />
    </Layout>
  );
};

export default Home;
