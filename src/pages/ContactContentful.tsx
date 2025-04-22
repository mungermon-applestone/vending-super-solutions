
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentfulResponse, ContentfulContactPageFields, ContentfulFAQItem } from '@/types/contentful';
import ContactCards from '@/components/contact/ContactCards';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
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
          if (faq.fields && typeof faq.fields.question === 'string' && typeof faq.fields.answer === 'string') {
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: faq.fields.answer,
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
          if (faq.fields && typeof faq.fields.question === 'string' && typeof faq.fields.answer === 'string') {
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: faq.fields.answer,
            });
          }
        });
      }
    }
    
    // Fourth approach: Direct check for the specific entry IDs we know
    if (processedFaqItems.length === 0) {
      console.log('Attempting to fetch individual FAQ entries directly');
      // This approach would require individual fetches for each ID, which we're not implementing here
      // but could be a fallback approach if needed
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
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/5 mb-2" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 text-red-500">
          Error loading contact page: {error instanceof Error ? error.message : String(error)}
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
    </Layout>
  );
};

export default ContactContentful;
