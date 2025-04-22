
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
  // Map all spec fields from the machine object
  const formattedSpecs: Record<string, string> = {
    ...(machine.specs || {}), // First spread any existing specs
    // Only add these fields if they don't already exist in the specs object
    ...(machine.specs?.dimensions ? {} : { dimensions: machine.specs?.dimensions || '' }),
    ...(machine.specs?.weight ? {} : { weight: machine.specs?.weight || '' }),
    ...(machine.specs?.powerRequirements ? {} : { powerRequirements: machine.specs?.powerRequirements || '' }),
    ...(machine.temperature ? { temperature: machine.temperature } : { temperature: 'Ambient' }),
    ...(machine.specs?.paymentOptions ? {} : { paymentOptions: machine.specs?.paymentOptions || '' }),
    ...(machine.specs?.connectivity ? {} : { connectivity: machine.specs?.connectivity || '' }),
    ...(machine.specs?.capacity ? {} : { capacity: machine.specs?.capacity || '' }),
    ...(machine.specs?.manufacturer ? {} : { manufacturer: machine.specs?.manufacturer || '' }),
    ...(machine.specs?.warranty ? {} : { warranty: machine.specs?.warranty || '' })
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
