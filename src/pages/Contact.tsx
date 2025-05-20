
import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { useContactFAQ } from '@/hooks/useContactFAQ';
import FAQSection from '@/components/contact/FAQSection';
import ContactCards from '@/components/contact/ContactCards';
import PageHero from '@/components/common/PageHero';
import ContactPageSEO from '@/components/seo/ContactPageSEO';

const Contact: React.FC = () => {
  const { data: faqData, isLoading } = useContactFAQ();
  const faqs = faqData?.faqs || [];

  return (
    <>
      {/* Add proper SEO */}
      <ContactPageSEO />
      
      {/* Hero Section */}
      <PageHero
        heading="Contact Us"
        subheading="Get in touch with our team to learn more about our vending solutions."
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
              <ContactCards data={faqData?.contactMethods || []} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection heading="Frequently Asked Questions" faqs={faqs} isLoading={isLoading} />
    </>
  );
};

export default Contact;
