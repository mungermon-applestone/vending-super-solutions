
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { isContentfulConfigured } from '@/config/cms';

// Import refactored components
import MachinesLoadingState from '@/components/machines/MachinesLoadingState';
import MachinesErrorState from '@/components/machines/MachinesErrorState';
import MachinesEmptyState from '@/components/machines/MachinesEmptyState';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import MachinesIntroSection from '@/components/machines/MachinesIntroSection';
import RefreshDataButton from '@/components/machines/RefreshDataButton';
import MachineGrid from '@/components/machines/MachineGrid';

// Define the Contentful entry ID for the machines page hero
// This ID specifically points to the hero content for the machines page
const MACHINES_HERO_ENTRY_ID = '3bH4WrT0pLKDeG35mUekGq';

const MachinesPage: React.FC = () => {
  const renderTime = new Date().toISOString();
  console.log(`[MachinesPage] Rendering at ${renderTime}`);
  console.log(`[MachinesPage] Using hero entry ID: ${MACHINES_HERO_ENTRY_ID}`);
  
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();
  const { data: pageContent } = useMachinesPageContent();
  const { data: testimonialSection } = useTestimonialSection('machines');
  
  useEffect(() => {
    if (machines) {
      console.log(`[MachinesPage] Retrieved ${machines.length} machines from Contentful:`, machines);
      if (machines.length === 0) {
        toast.warning('No machines found in Contentful. Check console logs for more details.');
      }
    }
  }, [machines]);

  console.log('[MachinesPage] Rendering with data:', {
    hasMachines: !!machines && machines.length > 0,
    machineCount: machines?.length || 0,
    hasPageContent: !!pageContent,
    hasTestimonials: !!testimonialSection,
    isContentfulConfigured: isContentfulConfigured(),
    heroEntryId: MACHINES_HERO_ENTRY_ID
  });

  const vendingMachines = machines?.filter(machine => machine.type === 'vending') || [];
  const lockers = machines?.filter(machine => machine.type === 'locker') || [];

  return (
    <Layout>
      <TechnologyPageHero 
        entryId={MACHINES_HERO_ENTRY_ID}
        fallbackTitle="Advanced Vending Machines"
        fallbackSubtitle="Our machines combine cutting-edge technology with reliable performance to meet your business needs."
        fallbackImageUrl="https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
      />

      {pageContent && (
        <MachinesIntroSection 
          introTitle={pageContent.introTitle} 
          introDescription={pageContent.introDescription} 
        />
      )}

      <div className="container py-12 md:py-16" id="machines-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pageContent?.machineTypesTitle || "Our Machine Range"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent?.machineTypesDescription || "Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs."}
          </p>
        </div>

        {!isContentfulConfigured() && <ContentfulConfigWarning />}

        <RefreshDataButton isLoading={isLoading} onRefresh={refetch} />

        {isLoading ? (
          <MachinesLoadingState />
        ) : error ? (
          <MachinesErrorState error={error} onRetry={refetch} />
        ) : (
          <>
            <MachineGrid machines={vendingMachines} title="Vending Machines" />
            <MachineGrid machines={lockers} title="Smart Lockers" />
            
            {vendingMachines.length === 0 && lockers.length === 0 && <MachinesEmptyState />}
          </>
        )}
      </div>
      
      {testimonialSection && <TestimonialsSection data={testimonialSection} />}
      
      <InquiryForm title="Interested in our machines?" />
    </Layout>
  );
};

export default MachinesPage;
