
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
  
  if (!machine) {
    console.error("Machine data is missing in MachineDetail component");
    return null;
  }
  
  // Ensure we have valid specs with fallbacks
  const formattedSpecs: Record<string, string> = {
    // First include any existing specs object properties
    ...(machine.specs || {}),
    
    // Add core properties that might be directly on the machine object
    // but fallback to empty strings if not found
    dimensions: machine.specs?.dimensions || '',
    weight: machine.specs?.weight || '',
    capacity: machine.specs?.capacity || '',
    powerRequirements: machine.specs?.powerRequirements || '',
    paymentOptions: machine.specs?.paymentOptions || '',
    connectivity: machine.specs?.connectivity || '',
    manufacturer: machine.specs?.manufacturer || '',
    warranty: machine.specs?.warranty || '',
    temperature: machine.temperature || machine.specs?.temperature || 'ambient',
  };
  
  // Ensure features is always an array
  const features = Array.isArray(machine.features) ? machine.features : [];
  
  // Log the formatted data for debugging
  console.log("Formatted specs for display:", formattedSpecs);
  console.log("Features for display:", features);
  console.log("Machine source:", machine.id, "with slug:", machine.slug);

  return (
    <>
      <div className="bg-blue-50 border-b border-blue-100 py-2 px-4 text-sm text-blue-600">
        Viewing machine from Contentful: ID: {machine.id} | Slug: {machine.slug} | Type: {machine.type}
      </div>
      <MachineDetailHero machine={machine} />
      <MachineDetailSpecifications specs={formattedSpecs} />
      <MachineDetailFeatures features={features} />
      <CTASection />
    </>
  );
};

export default MachineDetail;
