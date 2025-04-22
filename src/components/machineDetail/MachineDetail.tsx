
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
    dimensions: machine.dimensions || machine.specs?.dimensions || '',
    weight: machine.weight || machine.specs?.weight || '',
    powerRequirements: machine.powerRequirements || machine.specs?.powerRequirements || '',
    temperature: machine.temperature || 'Ambient',
    paymentOptions: machine.paymentOptions || machine.specs?.paymentOptions || '',
    connectivity: machine.connectivity || machine.specs?.connectivity || '',
    capacity: machine.capacity || machine.specs?.capacity || '',
    manufacturer: machine.manufacturer || machine.specs?.manufacturer || '',
    warranty: machine.warranty || machine.specs?.warranty || ''
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
