
import React from 'react';
import SimpleForm from '@/components/contact/SimpleForm';

interface InquiryFormProps {
  title?: string;
  description?: string;
  machineType?: string;
  formType?: string;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
  }
}

const InquiryForm = ({ 
  title = "Request a Demo", 
  description = "Fill out the form below, and one of our representatives will contact you to arrange a personalized demo of our vending solutions.",
  machineType,
  formType = "Demo Request",
}: InquiryFormProps) => {
  // Use our simplified form component for all machine inquiries
  return (
    <section className="bg-vending-blue-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
          
          <SimpleForm 
            formTitle="Submit Your Request" 
            formType={`${formType}${machineType ? ` - ${machineType}` : ''}`}
            className="bg-white rounded-lg shadow-lg p-6 md:p-8"
          />
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
