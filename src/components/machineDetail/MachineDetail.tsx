
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailFeatures from './MachineDetailFeatures';
import MachineDetailDeployments from './MachineDetailDeployments';
import MachineDetailGallery from './MachineDetailGallery';
import MachineDetailInquiry from './MachineDetailInquiry';
import CTASection from '@/components/common/CTASection';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  // Convert specs to the expected Record<string, string> format if it's an array or undefined
  const formattedSpecs: Record<string, string> = {};
  
  // If machine.specs exists and is an object, use it directly
  if (machine.specs && !Array.isArray(machine.specs)) {
    Object.assign(formattedSpecs, machine.specs);
  } 
  // If it's an array with elements that have key/value properties
  else if (Array.isArray(machine.specs)) {
    machine.specs.forEach(spec => {
      if (spec && typeof spec === 'object' && 'key' in spec && 'value' in spec) {
        formattedSpecs[spec.key] = spec.value;
      }
    });
  }
  
  return (
    <>
      <MachineDetailHero machine={machine} />
      <MachineDetailSpecifications specs={formattedSpecs} />
      <MachineDetailFeatures features={machine.features || []} />
      <MachineDetailDeployments deploymentExamples={machine.deploymentExamples || []} />
      <MachineDetailGallery title={machine.title} images={machine.images || []} />
      <MachineDetailInquiry machineTitle={machine.title} />
      <CTASection />
    </>
  );
};

export default MachineDetail;
