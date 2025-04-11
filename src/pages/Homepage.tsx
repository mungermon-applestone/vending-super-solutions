
import React from 'react';
import Layout from '@/components/layout/Layout';

// Import UI components
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import MachineTypesSection from '@/components/home/MachineTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Homepage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-16 md:space-y-24">
        <HeroSection />
        <FeaturesSection />
        <ProductTypesSection />
        <MachineTypesSection />
        <BusinessGoalsSection />
        <TestimonialsSection />
      </div>
    </Layout>
  );
};

export default Homepage;
