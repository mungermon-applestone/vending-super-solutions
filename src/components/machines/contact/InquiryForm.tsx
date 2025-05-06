
import React from 'react';
import { Check } from 'lucide-react';
import { StandardForm } from '@/components/common';

interface InquiryFormProps {
  title: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ title }) => {
  return (
    <section className="py-12 bg-vending-blue-light">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
              Ready to transform your vending operations?
            </h2>
            <p className="text-lg mb-8 text-gray-700">
              Let us show you how our software can streamline your operations, increase sales, and improve customer satisfaction.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Compatible with multiple machine types</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Easy to implement and use</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Dedicated support team</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Customizable to your specific needs</span>
              </div>
            </div>
          </div>
          
          <div>
            <StandardForm
              title="Request a Demo"
              formType="Demo Request"
              buttonText="Request Demo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
