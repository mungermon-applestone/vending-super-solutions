
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
  // Convert specs to the expected Record<string, string> format
  const formattedSpecs: Record<string, string> = {
    dimensions: machine.specs?.dimensions || '',
    weight: machine.specs?.weight || '',
    powerRequirements: machine.specs?.powerRequirements || '',
    temperature: machine.temperature || 'Ambient',
    paymentOptions: machine.specs?.paymentOptions || '',
    connectivity: machine.specs?.connectivity || '',
    capacity: machine.specs?.capacity || '',
    manufacturer: machine.specs?.manufacturer || '',
    warranty: machine.specs?.warranty || ''
  };

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
