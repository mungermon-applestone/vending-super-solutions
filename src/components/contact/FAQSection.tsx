
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
    // Add debugging to help identify content structure issues
    console.log('FAQ Content type:', typeof content, 'Content:', content);
    
    // Handle translated string content (most common after translation)
    if (typeof content === 'string') {
      return (
        <div className="prose prose-gray max-w-none">
          <p>{content}</p>
        </div>
      );
    }
    
    // Handle rich text Document objects from Contentful
    if (typeof content === 'object' && content !== null) {
      // Check if it's a Contentful Document with nodeType
      if ('nodeType' in content) {
        try {
          return (
            <div className="prose prose-gray max-w-none">
              {documentToReactComponents(content as Document)}
            </div>
          );
        } catch (error) {
          console.error('Error rendering rich text Document:', error, content);
          // Fallback to extracting text content if rich text fails
          if (content.content && Array.isArray(content.content)) {
            const textContent = content.content
              .map((node: any) => node.content?.[0]?.value || '')
              .join(' ');
            return <p>{textContent || 'Content not available'}</p>;
          }
          return <p className="text-red-500">Error rendering rich text content</p>;
        }
      }
      
      // Handle nested content structure (fallback)
      if (Array.isArray(content?.content)) {
        try {
          return (
            <div className="prose prose-gray max-w-none">
              {renderRichText(content, { includedAssets: [] })}
            </div>
          );
        } catch (error) {
          console.error('Error rendering nested content:', error, content);
          return <p className="text-red-500">Error rendering nested content</p>;
        }
      }
      
      // Handle object with text fields (translated content structure)
      if (content.value || content.text) {
        return <p>{content.value || content.text}</p>;
      }
    }
    
    // Handle null/undefined content
    if (!content) {
      return <p className="text-gray-500">No content available</p>;
    }
    
    // Final fallback - try to stringify the content
    console.warn('Unhandled FAQ content type:', typeof content, content);
    return <p className="text-gray-500">Content format not supported</p>;
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
