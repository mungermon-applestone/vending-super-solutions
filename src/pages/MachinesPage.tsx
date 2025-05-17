
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { isContentfulConfigured } from '@/config/cms';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

// Import refactored components
import MachinesLoadingState from '@/components/machines/MachinesLoadingState';
import MachinesErrorState from '@/components/machines/MachinesErrorState';
import MachinesEmptyState from '@/components/machines/MachinesEmptyState';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import MachinesIntroSection from '@/components/machines/MachinesIntroSection';
import RefreshDataButton from '@/components/machines/RefreshDataButton';
import MachineGrid from '@/components/machines/MachineGrid';
import { SimpleContactCTA } from '@/components/common';
import MachinesHero from '@/components/machines/MachinesHero';

// Define the machines page key for consistency
const MACHINES_PAGE_KEY = 'machines';

const MachinesPage: React.FC = () => {
  const renderTime = new Date().toISOString();
  console.log(`[MachinesPage] Rendering at ${renderTime}`);
  console.log(`[MachinesPage] Using page key: ${MACHINES_PAGE_KEY}`);
  
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();
  const { data: pageContent } = useMachinesPageContent();
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('machines');
  
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
    isContentfulConfigured: isContentfulConfigured()
  });

  const vendingMachines = machines?.filter(machine => machine.type === 'vending') || [];
  const lockers = machines?.filter(machine => machine.type === 'locker') || [];

  return (
    <>
      {/* Use the new MachinesHero component */}
      <MachinesHero />

      {pageContent && (
        <MachinesIntroSection 
          introTitle={pageContent.introTitle} 
          introDescription={pageContent.introDescription} 
        />
      )}

      <div className="container py-12 md:py-16" id="machines-section">
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
      
      <ContentfulTestimonialsCarousel 
        data={testimonialSection}
        isLoading={isLoadingTestimonials}
        error={testimonialError}
      />
      
      <SimpleContactCTA />
    </>
  );
};

export default MachinesPage;
