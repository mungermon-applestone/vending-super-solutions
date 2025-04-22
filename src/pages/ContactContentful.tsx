import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { ContentfulResponse, ContentfulContactPageFields, ContentfulFAQItem, ContentfulRichTextDocument } from '@/types/contentful';
import ContactCards from '@/components/contact/ContactCards';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';
import { Document } from '@contentful/rich-text-types';
import ContactLoadingState from "@/components/contact/ContactLoadingState";
import ContactErrorState from "@/components/contact/ContactErrorState";
import { useContactFAQ } from "@/hooks/useContactFAQ";

interface FAQItem {
  id: string;
  question: string;
  answer: string | Document | ContentfulRichTextDocument;
}

interface ContactPageContent {
  introTitle?: string;
  introDescription?: string;
  phoneCardTitle?: string;
  phoneNumber?: string;
  phoneAvailability?: string;
  emailCardTitle?: string;
  emailAddress?: string;
  emailResponseTime?: string;
  addressCardTitle?: string;
  address?: string;
  addressType?: string;
  formSectionTitle?: string;
  faqSectionTitle?: string;
  immediateAssistanceTitle?: string;
  immediateAssistanceDescription?: string;
  immediateAssistanceButtonText?: string;
  faqItems?: FAQItem[];
}

const CONTACT_ID = '1iQrxg7rN4Dk17ZdxPxfhj';

// Known FAQ item IDs to look for
const KNOWN_FAQ_IDS = [
  '1G2bj8dVx40vjJKK4d9fIc',
  '7If3Y7Mw2Gw1nPtCKLTrnN',
  '4JdSdjNDiPvmxVJPSCCYs5',
  '7mgtPwOLEiLSmmQ84jaYaB'
];

const ContactContentful = () => {
  const { processedData, isLoading, error, rawData } = useContactFAQ();

  if (isLoading) return <ContactLoadingState />;
  if (error) return <ContactErrorState error={error} includesEntryCount={rawData?.includes?.Entry?.length} knownFAQIds={[
    '1G2bj8dVx40vjJKK4d9fIc',
    '7If3Y7Mw2Gw1nPtCKLTrnN',
    '4JdSdjNDiPvmxVJPSCCYs5',
    '7mgtPwOLEiLSmmQ84jaYaB'
  ]} />;

  return (
    <Layout>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Info section */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                {processedData.introTitle || 'Get in Touch'}
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                {processedData.introDescription ||
                  'Have questions about our vending solutions? Ready to transform your retail operations? Contact our team today.'}
              </p>
              <ContactCards data={processedData} />
            </div>
            {/* Form */}
            <ContactForm formSectionTitle={processedData.formSectionTitle} />
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <FAQSection 
        faqSectionTitle={processedData.faqSectionTitle} 
        faqItems={processedData.faqItems}
      />
      {/* Debug information */}
      {processedData.faqItems?.length === 0 && (
        <div className="container mx-auto my-8 p-4 bg-yellow-50 border border-yellow-100 rounded">
          <h3 className="font-bold text-lg mb-2">FAQ Debug Information</h3>
          <p>No FAQ items were processed. Check the console for more details.</p>
          {rawData?.includes?.Entry && (
            <div className="mt-4">
              <p>Found {rawData.includes.Entry.length} entries in includes.</p>
              <p>Known FAQ IDs: {'1G2bj8dVx40vjJKK4d9fIc, 7If3Y7Mw2Gw1nPtCKLTrnN, 4JdSdjNDiPvmxVJPSCCYs5, 7mgtPwOLEiLSmmQ84jaYaB'}</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ContactContentful;
