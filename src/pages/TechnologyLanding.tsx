import React from 'react';
import Layout from '@/components/layout/Layout';
import { useTechnologies } from '@/hooks/cms/useTechnologies';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';

const TechnologyLanding = () => {
  const { data: technologies, isLoading } = useTechnologies();
  
  return (
    <Layout>
      <PageHero 
        pageKey="technology"
        fallbackTitle="Enterprise-Grade Technology"
        fallbackSubtitle="Our platform is built with security, scalability, and flexibility in mind to power your vending operations."
        fallbackImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
        fallbackImageAlt="Technology circuit board and digital interface"
        fallbackPrimaryButtonText="Learn More"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="View Tech Specs"
        fallbackSecondaryButtonUrl="#tech-details"
      />
      
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Technology Solutions</h2>
        {/* Technology cards would go here */}
      </div>
      
      <CTASection />
    </Layout>
  );
};

export default TechnologyLanding;
