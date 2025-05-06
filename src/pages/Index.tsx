
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import { SimpleContactCTA } from '@/components/common';
import { useHomePageContent } from '@/hooks/useHomePageContent';

const Index = () => {
  const { data: homeContent } = useHomePageContent();

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ProductTypesSection />
      <BusinessGoalsSection />
      <AvailableMachinesSection />
      <SimpleContactCTA 
        title={homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?"}
        description={homeContent?.ctaSectionDescription || "Get started with our platform today and see the difference in your operations."}
        className="w-full"
      />
    </Layout>
  );
};

export default Index;
