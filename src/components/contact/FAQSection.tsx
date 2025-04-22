
import React from 'react';
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
  // Debug: Log what we received
  console.log('FAQ Section received items:', faqItems?.length || 0);
  
  // Helper function to render the answer content properly
  const renderAnswer = (answer: string | Document | ContentfulRichTextDocument) => {
    // Check if the answer is a rich text document
    if (typeof answer === 'object' && answer !== null && 'nodeType' in answer) {
      console.log('Rendering answer as rich text document');
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
  
  // Display the FAQ section only if we have a title or items
  return (
    <div className="py-16 container max-w-7xl mx-auto">
      {faqSectionTitle && (
        <h2 className="text-3xl font-bold text-center mb-12">{faqSectionTitle}</h2>
      )}
      
      {/* Render dynamic FAQ items if present */}
      {faqItems && faqItems.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {faqItems.map((faq) => (
              <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">{faq.question}</h3>
                {renderAnswer(faq.answer)}
              </div>
            ))}
          </div>
          
          {/* Debug info - will be visible in UI but helpful for troubleshooting */}
          {faqItems.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800">
              <p>FAQ items array is present but empty.</p>
            </div>
          )}
        </>
      ) : (
        /* Fallback static FAQ if none from CMS */
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">What types of businesses use your vending solutions?</h3>
            <p className="text-gray-600">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">How quickly can your solutions be deployed?</h3>
            <p className="text-gray-600">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Do you offer installation and maintenance services?</h3>
            <p className="text-gray-600">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Can your vending machines be customized?</h3>
            <p className="text-gray-600">Absolutely! We offer customization options for branding, product selection, payment methods, and technology integration based on your business needs.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
