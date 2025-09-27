
import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import { ContactSection } from '@/components/common';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import TranslationDemo from '@/components/translation/TranslationDemo';
import LanguageMetaTags from '@/components/seo/LanguageMetaTags';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const { data: homeContent } = useHomePageContent();
  
  const { translated: homeTitle } = useTranslation("Applestone Solutions - Vending Machine Technology", {
    context: "page-titles",
    fallbackToOriginal: true
  });
  
  const { translated: homeDescription } = useTranslation("Transform your vending operations with our cutting-edge technology, innovative products, and comprehensive business solutions.", {
    context: "page-descriptions",
    fallbackToOriginal: true
  });

  return (
    <>
      <LanguageMetaTags 
        title={homeTitle}
        description={homeDescription}
        canonicalUrl={window.location.origin}
      />
      <HeroSlider sliderId="home-slider" />
      <div className="container mx-auto px-4 py-8">
        <TranslationDemo />
      </div>
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
