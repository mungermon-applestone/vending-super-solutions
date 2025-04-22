import React from 'react';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import MachineHero from './hero/MachineHero';
import SpecificationsSection from './specs/SpecificationsSection';
import FeaturesList from './features/FeaturesList';
import DeploymentExamplesSection from './examples/DeploymentExamplesSection';
import AdditionalViews from './gallery/AdditionalViews';
import InquiryForm from './contact/InquiryForm';
import TestimonialsSection from './testimonials/TestimonialsSection';

export interface MachineTemplateProps {
  machine: {
    id: string;
    slug: string;
    title: string;
    type: 'vending' | 'locker';
    temperature: string;
    description: string;
    images: Array<{
      url: string;
      alt: string;
    }>;
    specs: {
      [key: string]: string | undefined;
    };
    features: string[];
    deploymentExamples: Array<{
      title: string;
      description: string;
      image: {
        url: string;
        alt: string;
      };
    }>;
    testimonialSection: {
      title: string;
      description: string;
      image: {
        url: string;
        alt: string;
      };
    };
  };
}

const MachinePageTemplate: React.FC<MachineTemplateProps> = ({ machine }) => {
  return (
    <Layout>
      {/* Hero Section */}
      <MachineHero machine={machine} />
      
      {/* Specifications Section */}
      <section className="py-12 bg-white" id="specifications">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
            Specifications
          </h2>
          <div className="bg-vending-gray rounded-lg shadow-md p-8">
            <SpecificationsSection specs={machine.specs} />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-vending-gray" id="features">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
            Features
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <FeaturesList features={machine.features} />
          </div>
        </div>
      </section>
      
      {/* Deployment Examples Section */}
      <DeploymentExamplesSection examples={machine.deploymentExamples} />
      
      {/* Additional Views Section */}
      <AdditionalViews 
        title={machine.title} 
        images={machine.images} 
      />
      
      {/* Testimonials Section */}
      <TestimonialsSection data={machine.testimonialSection} />
      
      {/* Contact Section */}
      <InquiryForm title={machine.title} />

      <CTASection />
    </Layout>
  );
};

export default MachinePageTemplate;
