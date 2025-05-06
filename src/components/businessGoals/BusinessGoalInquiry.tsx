
import React from 'react';
import StandardContactForm from '@/components/contact/StandardContactForm';

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
                <p className="text-gray-700">{description}</p>
              )}
            </div>
            <div className="flex-1">
              <StandardContactForm 
                formTitle="Send Us a Message" 
                formType="contact"
                showSubject={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalInquiry;
