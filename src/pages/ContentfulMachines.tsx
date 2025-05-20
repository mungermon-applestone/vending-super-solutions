
import React from 'react';
import { useContentfulMachines } from '@/hooks/useContentfulMachines';
import MachineGrid from '@/components/machines/MachineGrid';
import MachinesErrorState from '@/components/machines/MachinesErrorState';
import MachinesLoadingState from '@/components/machines/MachinesLoadingState';
import MachinesEmptyState from '@/components/machines/MachinesEmptyState';
import MachinesHero from '@/components/machines/MachinesHero';
import MachinesIntroSection from '@/components/machines/MachinesIntroSection';
import { ContactSection } from '@/components/common';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import RefreshDataButton from '@/components/machines/RefreshDataButton';
import MachinesPageSEO from '@/components/seo/MachinesPageSEO';
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CONTENTFUL_CONFIG } from '@/config/cms';

const ContentfulMachines: React.FC = () => {
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();

  // Fetch page content from Contentful
  const { data: pageContent } = useQuery({
    queryKey: ['contentful', 'machines-page-content'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entry = await client.getEntry(CONTENTFUL_CONFIG.MACHINES_PAGE_ID || '');
      return entry;
    },
    enabled: !!CONTENTFUL_CONFIG.MACHINES_PAGE_ID
  });
  
  // Configuration error warning
  if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
    return <ContentfulConfigWarning />;
  }
  
  // Loading state
  if (isLoading) {
    return <MachinesLoadingState />;
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-8">
        <MachinesErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }
  
  // Empty state
  if (!machines || machines.length === 0) {
    return <MachinesEmptyState />;
  }
  
  // Helper function to safely access image URL
  const getImageUrl = (image: any) => {
    if (image && image.fields && image.fields.file) {
      return `https:${image.fields.file.url}`;
    }
    return undefined;
  };

  return (
    <>
      <MachinesPageSEO machines={machines} />
      
      {/* Hero Section */}
      <MachinesHero 
        title={pageContent?.fields?.heroTitle || 'Our Vending Machines'} 
        subtitle={pageContent?.fields?.heroSubtitle || 'Explore our selection of high-quality vending machines'}
        imageUrl={getImageUrl(pageContent?.fields?.heroImage)}
      />
      
      {/* Introduction Section */}
      <MachinesIntroSection 
        title={pageContent?.fields?.introTitle || 'Find the Perfect Machine for Your Needs'} 
        description={pageContent?.fields?.introDescription || 'We offer a variety of machines to suit different vending requirements and spaces.'}
        id="machines-list"
      />
      
      <div className="container mx-auto py-12 px-4">
        {/* Refresh Button for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4">
            <RefreshDataButton onRefresh={() => refetch()} />
          </div>
        )}
        
        {/* Machine Grid */}
        <MachineGrid machines={machines} />
      </div>
      
      {/* Contact Section */}
      <ContactSection 
        title={pageContent?.fields?.ctaTitle || "Ready to Get Started?"} 
        description={pageContent?.fields?.ctaDescription || "Contact us to learn more about our machines and find the perfect solution for your needs."} 
        formType="Machine Inquiry"
      />
    </>
  );
};

export default ContentfulMachines;
