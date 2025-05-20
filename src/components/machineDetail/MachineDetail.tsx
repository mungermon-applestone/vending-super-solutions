
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
      <MachineDetailHero 
        title={machine.title}
        description={machine.description}
        image={machine.image}
        machineType={machine.machineType}
      />

      {/* Gallery Section */}
      <MachineDetailGallery
        mainImage={machine.image}
        additionalImages={machine.additionalImages}
        title={machine.title}
      />

      {/* Features Section */}
      <MachineDetailFeatures
        features={machine.features}
      />

      {/* Specifications Section */}
      <MachineDetailSpecifications
        specifications={machine.specifications}
        machineType={machine.machineType}
      />

      {/* Deployments Examples */}
      {machine.deploymentExamples && machine.deploymentExamples.length > 0 && (
        <MachineDetailDeployments
          deployments={machine.deploymentExamples}
          title="Deployment Examples"
          description="See how this machine is being used in real-world scenarios."
        />
      )}

      {/* Inquiry Section */}
      <MachineDetailInquiry 
        machineName={machine.title}
        machineType={machine.machineType}
      />
    </>
  );
};

export default MachineDetail;
