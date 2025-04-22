
import React from 'react';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { ContentfulResponse, ContentfulContactPageFields, ContentfulRichTextDocument } from '@/types/contentful';
import { Document } from '@contentful/rich-text-types';
import useContentful from '@/hooks/useContentful';

interface FAQItem {
  id: string;
  question: string;
  answer: string | ContentfulRichTextDocument | Document;
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

const KNOWN_FAQ_IDS = [
  '1G2bj8dVx40vjJKK4d9fIc',
  '7If3Y7Mw2Gw1nPtCKLTrnN',
  '4JdSdjNDiPvmxVJPSCCYs5',
  '7mgtPwOLEiLSmmQ84jaYaB'
];

const CONTACT_ID = '1iQrxg7rN4Dk17ZdxPxfhj';

export function useContactFAQ() {
  const { data, isLoading, error } = useContentful<ContentfulResponse<ContentfulContactPageFields>>({
    queryKey: ['contact-page-content', CONTACT_ID],
    queryFn: async () => {
      const client = await getContentfulClient();
      return (await client.getEntry(CONTACT_ID, { include: 3 })) as unknown as ContentfulResponse<ContentfulContactPageFields>;
    },
  });

  const processedData = React.useMemo(() => {
    if (!data) return {} as ContactPageContent;
    const fields = data.fields || {};
    const typedFields = fields as ContentfulContactPageFields;
    const processedFaqItems: FAQItem[] = [];

    if (typedFields.faqItems && Array.isArray(typedFields.faqItems)) {
      typedFields.faqItems.forEach((item: any) => {
        if (item && item.fields && item.fields.question && item.fields.answer) {
          let processedAnswer: string | ContentfulRichTextDocument | Document = '';
          if (typeof item.fields.answer === 'string') {
            processedAnswer = item.fields.answer;
          } else if (
            typeof item.fields.answer === 'object' && 
            item.fields.answer !== null && 
            'nodeType' in item.fields.answer
          ) {
            processedAnswer = item.fields.answer as ContentfulRichTextDocument;
          }
          processedFaqItems.push({
            id: item.sys?.id || `faq-${processedFaqItems.length}`,
            question: item.fields.question,
            answer: processedAnswer
          });
        }
      });
    }

    if (processedFaqItems.length === 0 && data.includes?.Entry?.length) {
      const linkedFAQs = data.includes.Entry.filter(
        (e) => e.sys.contentType?.sys.id === 'faqItem'
      );

      if (linkedFAQs.length > 0) {
        linkedFAQs.forEach((faq: any) => {
          if (faq.fields && typeof faq.fields.question === 'string') {
            let processedAnswer: string | ContentfulRichTextDocument | Document = '';
            if (typeof faq.fields.answer === 'string') {
              processedAnswer = faq.fields.answer;
            } else if (
              typeof faq.fields.answer === 'object' && 
              faq.fields.answer !== null && 
              'nodeType' in faq.fields.answer
            ) {
              processedAnswer = faq.fields.answer as ContentfulRichTextDocument;
            }
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: processedAnswer
            });
          }
        });
      }
    }

    if (processedFaqItems.length === 0 && data.includes?.Entry?.length) {
      const knownFaqs = data.includes.Entry.filter(e => KNOWN_FAQ_IDS.includes(e.sys.id));
      if (knownFaqs.length > 0) {
        knownFaqs.forEach((faq: any) => {
          if (faq.fields && typeof faq.fields.question === 'string') {
            let processedAnswer: string | ContentfulRichTextDocument | Document = '';
            if (typeof faq.fields.answer === 'string') {
              processedAnswer = faq.fields.answer;
            } else if (
              typeof faq.fields.answer === 'object' && 
              faq.fields.answer !== null && 
              'nodeType' in faq.fields.answer
            ) {
              processedAnswer = faq.fields.answer as ContentfulRichTextDocument;
            }
            processedFaqItems.push({
              id: faq.sys.id,
              question: faq.fields.question,
              answer: processedAnswer
            });
          }
        });
      }
    }

    return {
      ...typedFields,
      faqItems: processedFaqItems
    };
  }, [data]);

  return { data, processedData, isLoading, error, rawData: data };
}
