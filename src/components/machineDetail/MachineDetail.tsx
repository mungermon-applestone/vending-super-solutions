
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailFeatures from './MachineDetailFeatures';
import CTASection from '@/components/common/CTASection';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  // Convert specs from individual properties to the expected Record<string, string> format
  const formattedSpecs: Record<string, string> = {
    ...(machine.specs || {}), // First spread any existing specs
    // Add temperature which might be directly on the machine object
    ...(machine.temperature ? { temperature: machine.temperature } : { temperature: 'Ambient' })
  };

  console.log("Machine data in MachineDetail component:", machine);
  console.log("Formatted specs:", formattedSpecs);

  return (
    <>
      <MachineDetailHero machine={machine} />
      <MachineDetailSpecifications specs={formattedSpecs} />
      <MachineDetailFeatures features={machine.features || []} />
      <CTASection />
    </>
  );
};

export default MachineDetail;
