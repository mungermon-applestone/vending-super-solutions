
import React from 'react';
import Layout from '@/components/layout/Layout';
import { StandardForm } from '@/components/common';
import { showSuccess, showError } from '@/utils/notification';

const ContactTest = () => {
  const handleSuccess = () => {
    showSuccess("Form submission test was successful!");
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Form Test</h1>
          <p className="mb-8 text-gray-600 text-center">
            This is a test page to verify that our contact forms are working correctly with the Supabase edge function.
          </p>
          
          <div className="bg-white shadow-md rounded-lg">
            <StandardForm 
              title="Test Contact Form"
              description="Fill out this form to test if the email sending functionality is working correctly."
              formType="Test Form"
              onSuccess={handleSuccess}
              buttonText="Submit Test Message"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactTest;
