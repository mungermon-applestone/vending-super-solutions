
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/services/contentful/client';
import { Document } from '@contentful/rich-text-types';

export interface FAQ {
  id: string;
  question: string;
  answer: Document;
}

export function useContactFAQ() {
  return useQuery({
    queryKey: ['contentful', 'contact', 'faq'],
    queryFn: async (): Promise<{ processedData: FAQ[] }> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'contactPage',
          limit: 1,
          include: 2, // Include linked entries up to 2 levels deep
        });
        
        if (response.items.length === 0) {
          console.warn('No contact page content found');
          return { processedData: [] };
        }
        
        // Get the FAQs from the contact page entry
        const contactPage = response.items[0];
        const faqs = contactPage.fields.faqs || [];
        
        // Make sure faqs is an array before mapping
        if (!Array.isArray(faqs)) {
          console.warn('FAQs field is not an array:', faqs);
          return { processedData: [] };
        }
        
        // Map the FAQs to our internal format
        const processedData = faqs.map((faq: any) => ({
          id: faq.sys.id,
          question: faq.fields.question,
          answer: faq.fields.answer,
        }));
        
        return { processedData };
      } catch (error) {
        console.error('Error fetching contact page FAQs:', error);
        return { processedData: [] };
      }
    },
  });
}
