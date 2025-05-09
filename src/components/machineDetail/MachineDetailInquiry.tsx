
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface MachineDetailInquiryProps {
  machineTitle?: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ 
  machineTitle
}) => {
  const title = machineTitle 
    ? `Interested in the ${machineTitle}?` 
    : "Interested in this machine?";
    
  return <SimpleContactCTA 
    title={title} 
    description="Contact us to learn more about pricing and availability." 
    primaryButtonText="Request Information" 
  />;
};

export default MachineDetailInquiry;
