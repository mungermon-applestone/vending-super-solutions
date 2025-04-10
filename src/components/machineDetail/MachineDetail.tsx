
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
  return (
    <>
      <MachineDetailHero machine={machine} />
      <MachineDetailSpecifications specs={machine.specs || []} />
      <MachineDetailFeatures features={machine.features || []} />
      <MachineDetailDeployments deploymentExamples={machine.deploymentExamples || []} />
      <MachineDetailGallery title={machine.title} images={machine.images || []} />
      <MachineDetailInquiry machineTitle={machine.title} />
      <CTASection />
    </>
  );
};

export default MachineDetail;
