
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import StandardContactForm from '@/components/contact/StandardContactForm';
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
      <section className="py-16 md:py-24 bg-vending-blue-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
                {homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?"}
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                {homeContent?.ctaSectionDescription || "Get started with our platform today and see the difference in your operations."}
              </p>
            </div>
            <div className="flex-1">
              <StandardContactForm 
                formTitle="Get in touch with us" 
                formType="contact"
                showSubject={true}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
