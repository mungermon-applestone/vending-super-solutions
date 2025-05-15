
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useContactFAQ, FAQ } from '@/hooks/useContactFAQ';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';
import ContactCards from '@/components/contact/ContactCards';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useContentfulInit } from '@/hooks/useContentfulInit';

const Contact = () => {
  const { isConnected, isLoading: isConnectionLoading, error: connectionError } = useContentfulInit();
  const { data: faqs, isLoading: isFAQsLoading, error: faqsError } = useContactFAQ();
  
  const isLoading = isConnectionLoading || isFAQsLoading;
  const error = connectionError || faqsError;
  
  console.log('Contact page rendering with:', { 
    isConnected, 
    connectionError,
    faqs, 
    faqsError,
    isLoading
  });
  
  // Default contact data
  const contactData = {
    email: 'info@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
  };
  
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        
        {/* Contact cards section */}
        <div className="mb-16">
          <ContactCards data={contactData} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <ContactForm />
            </div>
          </div>
          
          {/* FAQ section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="bg-white rounded-lg shadow-md p-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                  <span>Loading FAQs...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error loading FAQs</AlertTitle>
                  <AlertDescription>
                    {error.message || 'An unknown error occurred while loading FAQs'}
                  </AlertDescription>
                </Alert>
              ) : faqs && faqs.length > 0 ? (
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

export default Contact;
