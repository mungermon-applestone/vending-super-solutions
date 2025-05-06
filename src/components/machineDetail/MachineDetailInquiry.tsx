
import React from 'react';
import StandardContactForm from '@/components/contact/StandardContactForm';

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
              Complete the form below and one of our specialists will contact you with pricing and availability.
            </p>
            
            <StandardContactForm
              formTitle=""
              formType="inquiry"
              productInfo={{
                name: machineTitle,
                type: 'machine'
              }}
              showCompany={true}
              showPhone={true}
              submitButtonText="Submit Inquiry"
              successMessage={`Thank you for your interest in the ${machineTitle}. We'll be in touch shortly.`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailInquiry;
