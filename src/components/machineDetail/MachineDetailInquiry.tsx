
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
              Contact us today and one of our specialists will get back to you with pricing and availability.
            </p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Machine Specifications</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Custom configurations available</li>
                    <li>• Comprehensive warranty included</li>
                    <li>• Professional installation service</li>
                    <li>• Ongoing maintenance options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Why Choose Us</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Industry-leading technology</li>
                    <li>• Exceptional customer support</li>
                    <li>• Flexible financing options</li>
                    <li>• Proven track record</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4">
                <EmailLink 
                  subject={`Machine Inquiry: ${machineTitle}`}
                  body={`I'm interested in learning more about the ${machineTitle} machine. Please provide information about pricing, availability, and specifications.\n\nThank you.`}
                  buttonText="Request Information About This Machine" 
                  className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailInquiry;
