
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface MachineDetailInquiryProps {
  machineTitle: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ machineTitle }) => {
  return (
    <SimpleContactCTA 
      title="Ready to Get Started?"
      description={`Fill out the form and we'll start you on your vending journey.`}
    />
  );
};

export default MachineDetailInquiry;
