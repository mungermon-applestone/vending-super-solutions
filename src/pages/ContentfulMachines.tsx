
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MachineGrid from '@/components/machines/MachineGrid';
import MachinesHero from '@/components/machines/MachinesHero';
import MachinesIntroSection from '@/components/machines/MachinesIntroSection';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import { isContentfulConfigured } from '@/config/cms';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MachinesLoadingState from '@/components/machines/MachinesLoadingState';
import MachinesErrorState from '@/components/machines/MachinesErrorState';
import MachinesEmptyState from '@/components/machines/MachinesEmptyState';
import { ContactSection } from '@/components/common';
import MachinesPageSEO from '@/components/seo/MachinesPageSEO';

const ContentfulMachines: React.FC = () => {
  const navigate = useNavigate();
  const contentfulConfigured = isContentfulConfigured();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: pageContent } = useMachinesPageContent();
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();

  useEffect(() => {
    if (!contentfulConfigured) {
      console.warn('Contentful is not configured. Machine data may not be available.');
    }
  }, [contentfulConfigured]);

  const handleRefresh = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  if (!contentfulConfigured) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contentful Not Configured</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Your Contentful account needs to be configured to display machines.</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/admin/environment-variables')}>
                Configure Contentful
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {/* Add SEO component */}
      <MachinesPageSEO machines={machines} />
      
      {/* Hero Section */}
      <MachinesHero 
        heading={pageContent?.heroTitle || "Vending Machines"}
        subheading={pageContent?.heroDescription || "Explore our range of innovative vending machines designed for various use cases and industries."}
        imageUrl={pageContent?.heroImage?.url}
      />

      {/* Intro Section */}
      <MachinesIntroSection 
        heading={pageContent?.introTitle || "Our Machine Portfolio"}
        description={pageContent?.introDescription || "We offer a diverse range of vending machines that can be customized to meet your specific business needs."}
        key={`intro-${refreshKey}`}
      />

      {/* Machines Grid Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Machines</h2>
        
        {isLoading && <MachinesLoadingState />}
        
        {error && <MachinesErrorState error={error} onRetry={handleRefresh} />}
        
        {!isLoading && !error && machines && machines.length === 0 && (
          <MachinesEmptyState />
        )}
        
        {!isLoading && !error && machines && machines.length > 0 && (
          <MachineGrid 
            machines={machines}
            title="Our Available Machines"
          />
        )}
      </div>
      
      {/* Contact Section */}
      <ContactSection
        title="Ready to Get Started?"
        description="Get in touch and we'll start you on your vending journey."
        formType="Machines Page Inquiry"
      />
    </>
  );
};

export default ContentfulMachines;
