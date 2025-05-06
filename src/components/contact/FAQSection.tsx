
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { ContentfulRichTextDocument } from '@/types/contentful';

interface FAQItem {
  id: string;
  question: string;
  answer: string | Document | ContentfulRichTextDocument;
}

interface FAQSectionProps {
  faqSectionTitle?: string;
  faqItems?: FAQItem[];
}

const FAQSection = ({ faqSectionTitle, faqItems }: FAQSectionProps) => {
  // Helper function to render the answer content properly
  const renderAnswer = (answer: string | Document | ContentfulRichTextDocument) => {
    // Check if the answer is a rich text document
    if (typeof answer === 'object' && answer !== null && 'nodeType' in answer) {
      try {
        // Cast to Document for the documentToReactComponents function
        return documentToReactComponents(answer as Document);
      } catch (error) {
        console.error('Error rendering rich text:', error);
        return <p className="text-red-500">Error rendering content</p>;
      }
    }
    
    // Otherwise render as regular text
    return <p className="text-gray-600 whitespace-pre-line">{answer as string}</p>;
  };
  
  return (
    <div className="py-16 container max-w-7xl mx-auto">
      {faqSectionTitle && (
        <h2 className="text-3xl font-bold text-center mb-12">{faqSectionTitle}</h2>
      )}
      
      {/* Render FAQ items as accordions */}
      <div className="max-w-3xl mx-auto">
        {faqItems && faqItems.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={faq.id || `faq-${index}`} value={faq.id || `faq-${index}`}>
                <AccordionTrigger className="text-left font-medium text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {renderAnswer(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left font-medium text-base">
                What types of businesses use your vending solutions?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left font-medium text-base">
                How quickly can your solutions be deployed?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left font-medium text-base">
                Do you offer installation and maintenance services?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left font-medium text-base">
                Can your vending machines be customized?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">Absolutely! We offer customization options for branding, product selection, payment methods, and technology integration based on your business needs.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
