
import React from 'react';
import { EmailLink } from '@/components/common';

interface MachineDetailInquiryProps {
  machineTitle: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ machineTitle }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container-wide max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-vending-blue-dark">
              Interested in this machine?
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button below to send us an email about this machine. One of our specialists will contact you with pricing and availability.
            </p>
            
            <EmailLink 
              title={`Inquiry about ${machineTitle}`}
              subject={`Machine Inquiry: ${machineTitle}`}
              buttonText="Send Inquiry Email"
              description={`I'm interested in learning more about the ${machineTitle} machine. Please provide information about pricing, availability, and specifications.`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailInquiry;
