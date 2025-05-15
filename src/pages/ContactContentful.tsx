
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useContactFAQ, FAQ } from '@/hooks/useContactFAQ';
import ContactFormNew from '@/components/contact/ContactFormNew';
import FAQSection from '@/components/contact/FAQSection';
import ContactCards from '@/components/contact/ContactCards';
import ContactLoadingState from '@/components/contact/ContactLoadingState';
import ContactErrorState from '@/components/contact/ContactErrorState';
import { useContentfulInit } from '@/hooks/useContentfulInit';

const ContactContentful = () => {
  const { isConnected, isLoading: isConnectionLoading } = useContentfulInit();
  const { data: faqs, isLoading: isFAQsLoading, error: faqError } = useContactFAQ();
  
  console.log('Contact page rendering with:', { 
    isConnected, 
    isConnectionLoading,
    faqs, 
    faqError,
    isFAQsLoading
  });
  
  const isLoading = isConnectionLoading || isFAQsLoading;
  const error = faqError;

  if (isLoading) {
    return <ContactLoadingState />;
  }

  if (error) {
    return <ContactErrorState error={error} />;
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="mb-16">
          <ContactCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <ContactFormNew />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="bg-white rounded-lg shadow-md p-2">
              {faqs && faqs.length > 0 ? (
                <FAQSection faqs={faqs} />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No FAQs available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactContentful;
