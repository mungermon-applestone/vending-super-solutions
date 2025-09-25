
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailFeatures from './MachineDetailFeatures';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailGallery from './MachineDetailGallery';
import MachineDetailDeployments from './MachineDetailDeployments';
import MachineDetailInquiry from './MachineDetailInquiry';
import MachineDetailSEO from '@/components/seo/MachineDetailSEO';
import { useTranslatedMachine } from '@/hooks/useTranslatedMachine';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  const { translatedContent: translatedMachine, isLoading: isTranslating } = useTranslatedMachine(machine);
  
  // Use translated content if available, fallback to original
  const displayMachine = translatedMachine || machine;

  return (
    <>
      {/* Add SEO optimization */}
      <MachineDetailSEO machine={displayMachine} />
      
      {/* Hero Section */}
      <MachineDetailHero machine={displayMachine} />

      {/* Gallery Section */}
      <MachineDetailGallery 
        title={displayMachine.title}
        images={displayMachine.images || []}
      />

      {/* Features Section */}
      <MachineDetailFeatures
        features={displayMachine.features || []}
      />

      {/* Specifications Section */}
      <MachineDetailSpecifications
        specs={displayMachine.specs || {}}
      />

      {/* Deployments Examples */}
      {displayMachine.deploymentExamples && displayMachine.deploymentExamples.length > 0 && (
        <MachineDetailDeployments
          deploymentExamples={displayMachine.deploymentExamples}
        />
      )}

      {/* Inquiry Section */}
      <MachineDetailInquiry 
        machineTitle={displayMachine.title}
      />
    </>
  );
};

export default MachineDetail;
