import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ContactCards from '@/components/contact/ContactCards';
import { useContactFAQ } from '@/hooks/useContactFAQ';
import ContactLoadingState from '@/components/contact/ContactLoadingState';
import ContactFallback from '@/components/contact/ContactFallback';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import { SimpleContactCTA } from '@/components/common';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { ContentfulRichTextDocument } from '@/types/contentful';
import ContactForm from '@/components/contact/ContactForm';

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
  } = processedData;
  
  // Helper function to render rich text content
  const renderRichText = (content: string | Document | ContentfulRichTextDocument) => {
    if (typeof content === 'object' && content !== null && 'nodeType' in content) {
      try {
        return documentToReactComponents(content as Document);
      } catch (error) {
        console.error('Error rendering rich text:', error);
        return <p className="text-red-500">Error rendering content</p>;
      }
    }
    return <p className="text-gray-600 whitespace-pre-line">{content as string}</p>;
  };

  return (
    <div className="container mx-auto py-12">
      {/* Page Title & Description */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{introTitle || 'Contact Us'}</h1>
        <p className="text-lg text-gray-600 mb-8">{introDescription || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Cards on the left */}
        <div>
          <ContactCards data={processedData} />
        </div>
        
        {/* Contact Form on the right */}
        <ContactForm formSectionTitle="Send Us a Message" />
      </div>
      
      {/* FAQ Accordion Section */}
      <div className="mt-16 mb-16">
        <h2 className="text-2xl font-semibold mb-6">{faqSectionTitle || 'Frequently Asked Questions'}</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          {faqItems && faqItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, index) => (
                <AccordionItem key={faq.id || `faq-${index}`} value={faq.id || `faq-${index}`}>
                  <AccordionTrigger className="text-left text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm">{renderRichText(faq.answer)}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-left text-base">
                  What types of businesses use your vending solutions?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-left text-base">
                  How quickly can your solutions be deployed?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-left text-base">
                  Do you offer installation and maintenance services?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-left text-base">
                  Can your vending machines be customized?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">Absolutely! We offer customization options for branding, product selection, payment methods, and technology integration based on your business needs.</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
      
      {/* Simple Contact CTA at the bottom */}
      <SimpleContactCTA 
        title="Ready to Get Started?" 
        description="Our team is ready to help you find the perfect vending solution for your business."
        className="w-full"
      />
    </div>
  );
};

export default ContactPage;
