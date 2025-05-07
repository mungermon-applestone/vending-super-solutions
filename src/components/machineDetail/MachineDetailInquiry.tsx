
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface MachineDetailInquiryProps {
  machineTitle?: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = () => {
  // Use standard CTA without custom title
  return <SimpleContactCTA />;
};

export default MachineDetailInquiry;
