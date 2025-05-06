
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface MachineDetailInquiryProps {
  machineTitle?: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ machineTitle }) => {
  return <SimpleContactCTA title={machineTitle ? `Interested in the ${machineTitle}?` : undefined} />;
};

export default MachineDetailInquiry;
