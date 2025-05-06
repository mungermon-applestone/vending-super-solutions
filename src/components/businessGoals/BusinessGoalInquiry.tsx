
import React from 'react';
import { EmailLink } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
  bulletPoints?: string[];
  buttonText?: string;
  buttonUrl?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({
  title = "Need a Custom Solution?",
  description,
}) => {
  return (
    <section className="py-16 bg-vending-blue-light bg-opacity-10">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-vending-blue-dark">{title}</h2>
              {description && (
                <p className="text-gray-700 mb-6">{description}</p>
              )}
              <EmailLink 
                subject="Custom Solution Inquiry" 
                buttonText="Email Us About Custom Solutions" 
                className="w-full md:w-auto"
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4">Our Approach</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Understand your unique business needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Develop customized vending solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Implement seamlessly with your existing operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Provide ongoing support and optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalInquiry;
