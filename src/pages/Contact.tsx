
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ContactForm from '@/components/contact/ContactForm';
import ContactCards from '@/components/contact/ContactCards';
import FAQSection from '@/components/contact/FAQSection';
import { useContactFAQ } from '@/hooks/useContactFAQ';
import ContactLoadingState from '@/components/contact/ContactLoadingState';
import ContactFallback from '@/components/contact/ContactFallback';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';

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
        <p className="text-lg text-gray-600">{introDescription || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Cards */}
        <div>
          <ContactCards data={processedData} />
        </div>
        
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">{formSectionTitle || 'Send Us a Message'}</h2>
          <ContactForm />
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
