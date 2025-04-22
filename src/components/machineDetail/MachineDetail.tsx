
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
  console.log("Machine data in MachineDetail component:", machine);
  
  // Create a consolidated specs object from all possible sources
  const formattedSpecs: Record<string, string> = {
    // First include any existing specs object
    ...(machine.specs || {}),
    
    // Add temperature which might be directly on the machine object
    ...(machine.temperature ? { temperature: machine.temperature } : {})
  };
  
  console.log("Formatted specs for display:", formattedSpecs);

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
