
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

// Default ID for machines page content - add as fallback since it might not exist in the config
const DEFAULT_MACHINES_PAGE_ID = '1FKl8bOPTBOMrGYg9jmfQH';

const ContentfulMachines: React.FC = () => {
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();

  // Fetch page content from Contentful with fallback ID
  const { data: pageContent } = useQuery({
    queryKey: ['contentful', 'machines-page-content'],
    queryFn: async () => {
      const client = await getContentfulClient();
      try {
        // Try to use config ID if exists, otherwise use default
        const entryId = DEFAULT_MACHINES_PAGE_ID;
        const entry = await client.getEntry(entryId);
        return entry;
      } catch (error) {
        console.error('Error fetching machines page content:', error);
        return null;
      }
    }
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

  // Map the machines data to match CMSMachine interface
  const mappedMachines = machines.map(machine => ({
    ...machine,
    // Ensure images have the required id property
    images: (machine.images || []).map((img: any, index: number) => ({
      id: img.id || `img-${machine.id}-${index}`,
      url: img.url,
      alt: img.alt || machine.title
    }))
  }));

  return (
    <>
      <MachinesPageSEO machines={mappedMachines} />
      
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
        <MachineGrid machines={mappedMachines} />
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
