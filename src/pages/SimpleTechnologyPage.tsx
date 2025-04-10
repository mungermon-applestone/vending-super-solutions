
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { useTechnologySections } from '@/hooks/useTechnologySections';

const SimpleTechnologyPage = () => {
  const technologies = useTechnologySections();

  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyHeroSimple />

      {/* Technology Sections */}
      {technologies.map((tech, index) => (
        <TechnologySection
          key={tech.id}
          id={tech.id}
          title={tech.title}
          description={tech.description}
          features={tech.features}
          image={tech.image}
          index={index}
        />
      ))}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
