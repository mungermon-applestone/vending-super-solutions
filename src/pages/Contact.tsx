
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ContactCards from '@/components/contact/ContactCards';
import FAQSection from '@/components/contact/FAQSection';
import { useContactFAQ } from '@/hooks/useContactFAQ';
import ContactLoadingState from '@/components/contact/ContactLoadingState';
import ContactFallback from '@/components/contact/ContactFallback';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import { EmailLink } from '@/components/common';

const ContactPage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <ContentfulInitializer
        fallback={<ContactFallback />}
      >
        <ContactContent />
      </ContentfulInitializer>
    </Layout>
  );
};

const ContactContent = () => {
  const { processedData, isLoading, error } = useContactFAQ();

  // Handle loading state
  if (isLoading) {
    return <ContactLoadingState />;
  }

  // Handle error state
  if (error) {
    console.error('Error loading contact page data:', error);
    return <ContactFallback />;
  }

  // Show fallback if no processed data
  if (!processedData) {
    console.error('No processed data available for contact page');
    return <ContactFallback />;
  }

  const { 
    introTitle, 
    introDescription,
    faqItems = [],
    faqSectionTitle,
    formSectionTitle
  } = processedData;

  return (
    <div className="container mx-auto py-12">
      {/* Page Title & Description */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{introTitle || 'Contact Us'}</h1>
        <p className="text-lg text-gray-600 mb-8">{introDescription || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}</p>
        <div className="flex justify-center">
          <EmailLink
            subject="Website Contact Inquiry"
            buttonText="Email Us Now"
            className="bg-vending-blue hover:bg-vending-blue-dark text-white px-8 py-3 text-lg"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Cards */}
        <div>
          <ContactCards data={processedData} />
        </div>
        
        {/* Email Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">{formSectionTitle || 'Get In Touch'}</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">General Inquiries</h3>
                <EmailLink
                  emailAddress="info@applestonesolutions.com"
                  subject="General Inquiry"
                  buttonText="Send General Inquiry"
                  className="w-full"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Sales Department</h3>
                <EmailLink
                  emailAddress="sales@applestonesolutions.com"
                  subject="Sales Inquiry"
                  buttonText="Contact Sales Team"
                  className="w-full"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Technical Support</h3>
                <EmailLink
                  emailAddress="support@applestonesolutions.com"
                  subject="Support Request"
                  buttonText="Contact Technical Support"
                  className="w-full"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Business Development</h3>
                <EmailLink
                  emailAddress="business@applestonesolutions.com"
                  subject="Business Development Inquiry"
                  buttonText="Contact Business Development"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      {faqItems && faqItems.length > 0 && (
        <FAQSection 
          faqSectionTitle={faqSectionTitle || 'Frequently Asked Questions'} 
          faqItems={faqItems} 
        />
      )}
    </div>
  );
};

export default ContactPage;
