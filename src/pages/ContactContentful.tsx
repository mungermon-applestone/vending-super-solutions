
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';
import ContactCards from '@/components/contact/ContactCards';
import ContactLoadingState from "@/components/contact/ContactLoadingState";
import ContactErrorState from "@/components/contact/ContactErrorState";
import ContactFallback from "@/components/contact/ContactFallback";
import { useContactFAQ } from "@/hooks/useContactFAQ";
import SEO from '@/components/seo/SEO';
import { SimpleContactCTA } from '@/components/common';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { ContentfulRichTextDocument } from '@/types/contentful';

const ContactContentful = () => {
  const { processedData, isLoading, error, rawData } = useContactFAQ();
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Contact", url: "/contact", position: 2 }
    ]);
  }, [setBreadcrumbs]);

  if (isLoading) return <ContactLoadingState />;
  if (error) {
    // For serious errors, show the error state
    return <ContactFallback />;
  }

  // Helper function to render rich text content
  const renderRichText = (content: string | Document | ContentfulRichTextDocument) => {
    if (typeof content === 'object' && content !== null && 'nodeType' in content) {
      try {
        return documentToReactComponents(content as Document);
      } catch (error) {
        console.error('Error rendering rich text:', error);
        return <p className="text-red-500">Error rendering content</p>;
      }
    }
    return <p className="text-gray-600 whitespace-pre-line">{content as string}</p>;
  };

  return (
    <Layout>
      <SEO 
        title="Contact Us | Vending Solutions"
        description="Get in touch with our team for vending machine solutions, support, and business inquiries."
        canonicalUrl="https://yourdomain.com/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Vending Solutions",
          "description": "Get in touch with our team",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": getSchemaFormattedBreadcrumbs()
          }
        }}
      />

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink aria-current="page">Contact</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

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
            
            {/* FAQ Accordion replacing the form */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">{processedData.faqSectionTitle || 'Frequently Asked Questions'}</h2>
              {processedData.faqItems && processedData.faqItems.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {processedData.faqItems.map((faq, index) => (
                    <AccordionItem key={faq.id || `faq-${index}`} value={faq.id || `faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderRichText(faq.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger className="text-left">
                      What types of businesses use your vending solutions?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger className="text-left">
                      How quickly can your solutions be deployed?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger className="text-left">
                      Do you offer installation and maintenance services?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple Contact CTA at the bottom */}
      <SimpleContactCTA 
        title="Ready to Get in Touch?" 
        description="Our team is ready to help you find the perfect vending solution for your business."
        className="w-full"
      />
    </Layout>
  );
};

export default ContactContentful;
