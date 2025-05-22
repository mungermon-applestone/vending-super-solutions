
import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import { ContactSection } from '@/components/common';
import { useHomePageContent } from '@/hooks/useHomePageContent';

const Index = () => {
  const { data: homeContent } = useHomePageContent();

  return (
    <>
      <HeroSlider sliderId="home-slider" />
      <FeaturesSection />
      <ProductTypesSection />
      <BusinessGoalsSection />
      <AvailableMachinesSection />
      <ContactSection 
        title="Ready to Transform Your Vending Operations?"
        description="Get in touch and we'll start you on your vending journey."
        className="w-full"
        formType="Home Page Inquiry"
      />
    </>
  );
};

export default Index;
