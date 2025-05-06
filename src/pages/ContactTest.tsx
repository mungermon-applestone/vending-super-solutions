
import React from 'react';
import Layout from '@/components/layout/Layout';
import { EmailLink } from '@/components/common';

const ContactTest = () => {
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          <p className="mb-8 text-gray-600 text-center">
            Have questions or need assistance? Use the contact information below to get in touch with us.
          </p>
          
          <div className="bg-white shadow-md rounded-lg">
            <EmailLink 
              title="Contact Our Team"
              subject="Website Inquiry"
              description="Click the button below to send us an email. We'll get back to you as soon as possible."
              buttonText="Send Us a Message"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactTest;
