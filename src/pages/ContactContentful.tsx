
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';
import ContactCards from '@/components/contact/ContactCards';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';
import ContactLoadingState from "@/components/contact/ContactLoadingState";
import ContactErrorState from "@/components/contact/ContactErrorState";
import ContactFallback from "@/components/contact/ContactFallback";
import { useContactFAQ } from "@/hooks/useContactFAQ";
import SEO from '@/components/seo/SEO';

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
            {/* Form */}
            <ContactForm formSectionTitle={processedData.formSectionTitle} />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <FAQSection 
        faqSectionTitle={processedData.faqSectionTitle || 'Frequently Asked Questions'} 
        faqItems={processedData.faqItems || []}
      />
    </Layout>
  );
};

export default ContactContentful;
