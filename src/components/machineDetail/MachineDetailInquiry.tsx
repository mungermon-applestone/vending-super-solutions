
import React from 'react';
import { EmailLink } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';

interface MachineDetailInquiryProps {
  machineTitle: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ machineTitle }) => {
  return (
    <section className="py-8 bg-white">
      <div className="container-wide max-w-4xl">
        <Card className="bg-white shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3 text-vending-blue-dark">
                Interested in this machine?
              </h2>
              <p className="text-gray-600 mb-4 max-w-xl mx-auto">
                Contact us today and one of our specialists will get back to you with pricing and availability.
              </p>
              
              <EmailLink 
                subject={`Machine Inquiry: ${machineTitle}`}
                body={`I'm interested in learning more about the ${machineTitle} machine. Please provide information about pricing, availability, and specifications.\n\nThank you.`}
                buttonText="Request Information" 
                className="bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3 px-6"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MachineDetailInquiry;
