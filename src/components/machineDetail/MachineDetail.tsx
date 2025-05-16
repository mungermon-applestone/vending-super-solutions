
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailFeatures from './MachineDetailFeatures';
import MachineDetailDeployments from './MachineDetailDeployments';
import MachineDetailGallery from './MachineDetailGallery';
import CTASection from '@/components/common/CTASection';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  // Log machine data to help with debugging
  console.log('[MachineDetail] Rendering machine detail:', {
    id: machine.id,
    title: machine.title,
    hasThumbnail: !!machine.thumbnail,
    thumbnailUrl: machine.thumbnail?.url || 'none',
    hasImages: machine.images?.length > 0
  });

  return (
    <div>
      <MachineDetailHero machine={machine} />
      
      <div className="container mx-auto px-4 py-12">
        <MachineDetailSpecifications specs={machine.specs} />
        <MachineDetailFeatures features={machine.features} />
        <MachineDetailDeployments deploymentExamples={machine.deploymentExamples} />
        <MachineDetailGallery title={machine.title} images={machine.images} />
      </div>
      
      <CTASection />
    </div>
  );
};

export default MachineDetail;
