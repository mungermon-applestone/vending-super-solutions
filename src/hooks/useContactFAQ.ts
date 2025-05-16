
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';
import { Document } from '@contentful/rich-text-types';

export interface FAQ {
  id: string;
  question: string;
  answer: Document;
}

export function useContactFAQ() {
  const query = useQuery({
    queryKey: ['contentful', 'contact', 'faq'],
    queryFn: async (): Promise<FAQ[]> => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'contactPage',
          limit: 1,
          include: 2, // Include linked entries up to 2 levels deep
        });
        
        if (response.items.length === 0) {
          console.warn('No contact page content found');
          return [];
        }
        
        // Get the FAQs from the contact page entry
        const contactPage = response.items[0];
        const faqs = contactPage.fields.faqs || [];
        
        // Make sure faqs is an array before mapping
        if (!Array.isArray(faqs)) {
          console.warn('FAQs field is not an array:', faqs);
          return [];
        }
        
        // Map the FAQs to our internal format
        return faqs.map((faq: any) => ({
          id: faq.sys.id,
          question: faq.fields.question,
          answer: faq.fields.answer,
        }));
      } catch (error) {
        console.error('Error fetching contact page FAQs:', error);
        return [];
      }
    },
  });

  // Add processedData property for backward compatibility
  const result = query as any;
  result.processedData = result.data || [];
  
  return result;
}
