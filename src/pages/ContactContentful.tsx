
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { ContentfulResponse, ContentfulContactPageFields, ContentfulFAQItem, ContentfulRichTextDocument } from '@/types/contentful';
import ContactCards from '@/components/contact/ContactCards';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';
import { Document } from '@contentful/rich-text-types';

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
  const { data, isLoading, error } = useContentful<ContentfulResponse<ContentfulContactPageFields>>({
    queryKey: ['contact-page-content', CONTACT_ID],
    queryFn: async () => {
      const client = await getContentfulClient();
      console.log('Fetching contact page with ID:', CONTACT_ID);
      // Include 3 to get deeply linked FAQ entries
      const entry = await client.getEntry(CONTACT_ID, { include: 3 });
      
      console.log('Raw contact entry:', JSON.stringify(entry, null, 2));
      return entry as unknown as ContentfulResponse<ContentfulContactPageFields>;
    },
  });

  // Process FAQ items separately after data is loaded
  const processedData = React.useMemo(() => {
    if (!data) return {} as ContactPageContent;
    
    console.log('Processing contact page data:', data);
    
    // Extract main fields
    const fields = data.fields || {};
    
    // Cast to ensure TypeScript knows the structure
    const typedFields = fields as ContentfulContactPageFields;
    
    // Extract linked FAQ entries if included
    const processedFaqItems: FAQItem[] = [];
    
    // First approach: Check for direct faqItems in the fields
    if (typedFields.faqItems && Array.isArray(typedFields.faqItems)) {
      console.log('Found FAQ items directly in fields:', typedFields.faqItems.length);
      
      typedFields.faqItems.forEach((item) => {
        if (item && item.fields && item.fields.question && item.fields.answer) {
          processedFaqItems.push({
            id: item.sys?.id || `faq-${processedFaqItems.length}`,
            question: item.fields.question,
            answer: item.fields.answer,
          });
          console.log(`Processed FAQ item ${item.sys?.id}:`, {
            question: item.fields.question,
            answerType: typeof item.fields.answer,
            isRichText: typeof item.fields.answer === 'object' && item.fields.answer !== null && 'nodeType' in item.fields.answer
          });
        }
      });
    }
    
    // Second approach: Look in includes.Entry if available
    if (processedFaqItems.length === 0 && data.includes?.Entry?.length) {
      console.log('Looking for FAQ items in includes:', data.includes.Entry.length);
      
      // Filter entries that are FAQ items by content type
      const linkedFAQs = data.includes.Entry.filter(
        (e) => e.sys.contentType?.sys.id === 'faqItem'
      );
      
      console.log('Found FAQ items by content type in includes:', linkedFAQs.length);
      
      if (linkedFAQs.length > 0) {
        linkedFAQs.forEach((faq) => {
          if (faq.fields && typeof faq.fields.question === 'string') {
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: faq.fields.answer,
            });
            console.log(`Processed FAQ item ${faq.sys.id}:`, {
              question: faq.fields.question,
              answerType: typeof faq.fields.answer,
              isRichText: typeof faq.fields.answer === 'object' && faq.fields.answer !== null && 'nodeType' in faq.fields.answer
            });
          }
        });
      }
    }
    
    // Third approach: Look specifically for the known FAQ IDs
    if (processedFaqItems.length === 0 && data.includes?.Entry?.length) {
      console.log('Searching for known FAQ IDs in includes');
      
      // Look for entries matching our known IDs
      const knownFaqs = data.includes.Entry.filter(e => KNOWN_FAQ_IDS.includes(e.sys.id));
      console.log('Found known FAQs by ID:', knownFaqs.length);
      
      if (knownFaqs.length > 0) {
        knownFaqs.forEach(faq => {
          if (faq.fields && typeof faq.fields.question === 'string') {
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: faq.fields.answer,
            });
            console.log(`Processed FAQ item ${faq.sys.id}:`, {
              question: faq.fields.question,
              answerType: typeof faq.fields.answer,
              isRichText: typeof faq.fields.answer === 'object' && faq.fields.answer !== null && 'nodeType' in faq.fields.answer
            });
          }
        });
      }
    }
    
    console.log('Final processed FAQ items:', processedFaqItems);
    
    return {
      ...typedFields,
      faqItems: processedFaqItems
    };
  }, [data]);
  
  console.log('Contact page processed data:', processedData);

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5 mb-2"></div>
            <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Contact Information</h2>
          <p>{error instanceof Error ? error.message : String(error)}</p>
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded">
            <p className="text-sm">Technical details: {JSON.stringify(error)}</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <ContactForm 
              formSectionTitle={processedData.formSectionTitle} 
            />
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
          
          {data?.includes?.Entry && (
            <div className="mt-4">
              <p>Found {data.includes.Entry.length} entries in includes.</p>
              <p>Known FAQ IDs: {KNOWN_FAQ_IDS.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ContactContentful;
