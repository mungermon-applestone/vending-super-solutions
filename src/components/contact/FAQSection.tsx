import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { ContentfulFAQItem } from '@/types/contentful';

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
                <AccordionTrigger className="px-6 py-4 text-left font-medium">
                  {faq.fields.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">
                  {typeof faq.fields.answer === 'string' ? (
                    <p>{faq.fields.answer}</p>
                  ) : (
                    <div>
                      {/* If the answer is a rich text document, render it simply for now */}
                      <p>
                        {typeof faq.fields.answer === 'object' && faq.fields.answer?.content ? 
                          'See expanded answer' : 'Answer content not available'}
                      </p>
                    </div>
                  )}
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
