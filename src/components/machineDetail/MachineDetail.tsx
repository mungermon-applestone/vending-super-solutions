
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailFeatures from './MachineDetailFeatures';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailGallery from './MachineDetailGallery';
import MachineDetailDeployments from './MachineDetailDeployments';
import MachineDetailInquiry from './MachineDetailInquiry';
import MachineDetailSEO from '@/components/seo/MachineDetailSEO';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  return (
    <>
      {/* Add SEO optimization */}
      <MachineDetailSEO machine={machine} />
      
      {/* Hero Section */}
      <MachineDetailHero machine={machine} />

      {/* Gallery Section */}
      <MachineDetailGallery 
        title={machine.title}
        images={machine.images || []}
      />

      {/* Features Section */}
      <MachineDetailFeatures
        features={machine.features || []}
      />

      {/* Specifications Section */}
      <MachineDetailSpecifications
        specs={machine.specs || {}}
      />

      {/* Deployments Examples */}
      {machine.deploymentExamples && machine.deploymentExamples.length > 0 && (
        <MachineDetailDeployments
          deploymentExamples={machine.deploymentExamples}
        />
      )}

      {/* Inquiry Section */}
      <MachineDetailInquiry 
        machineTitle={machine.title}
      />
    </>
  );
};

export default MachineDetail;
