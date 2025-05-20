
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { ContentfulFAQItem } from '@/types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { renderRichText } from '@/utils/contentful/richTextRenderer';

interface FAQSectionProps {
  title: string;
  faqs: ContentfulFAQItem[];
  isLoading?: boolean;
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  title, 
  faqs = [], 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  // Helper function to render content based on its type
  const renderFAQContent = (content: any) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    } else if (typeof content === 'object' && content !== null && 'nodeType' in content) {
      try {
        return documentToReactComponents(content as Document);
      } catch (error) {
        console.error('Error rendering rich text content:', error);
        return <p className="text-red-500">Error rendering content</p>;
      }
    } else if (Array.isArray(content?.content)) {
      // Handle nested content structure
      return <div>{renderRichText(content, { includedAssets: [] })}</div>;
    }
    
    return <p className="text-gray-500">Content not available</p>;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={faq.sys.id || index} 
                value={faq.sys.id || `faq-${index}`}
                className="bg-white mb-4 rounded-lg shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-2xl">
                  {faq.fields.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">
                  <div className="rich-text-content text-lg">
                    {renderFAQContent(faq.fields.answer)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
