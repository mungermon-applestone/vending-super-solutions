
import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { useContactFAQ } from '@/hooks/useContactFAQ';
import FAQSection from '@/components/contact/FAQSection';
import ContactCards from '@/components/contact/ContactCards';
import PageHero from '@/components/common/PageHero';
import ContactPageSEO from '@/components/seo/ContactPageSEO';

const Contact: React.FC = () => {
  const { processedData, isLoading } = useContactFAQ();
  
  // Convert FAQItems to ContentfulFAQItem format expected by FAQSection
  const contentfulFaqs = React.useMemo(() => {
    if (!processedData?.faqItems || !Array.isArray(processedData.faqItems)) return [];
    
    return processedData.faqItems.map(faq => ({
      sys: { id: faq.id },
      fields: {
        question: faq.question,
        answer: faq.answer
      }
    }));
  }, [processedData?.faqItems]);

  return (
    <>
      {/* Add proper SEO */}
      <ContactPageSEO />
      
      {/* Hero Section */}
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team to learn more about our vending solutions."
        className="bg-blue-50"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Contact Form */}
            <ContactForm formSectionTitle="Send Us a Message" />
            
            {/* Contact Cards */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h2>
              {/* Pass processedData directly to ContactCards */}
              <ContactCards data={processedData || {}} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        title="Frequently Asked Questions" 
        faqs={contentfulFaqs} 
        isLoading={isLoading} 
      />
    </>
  );
};

export default Contact;
