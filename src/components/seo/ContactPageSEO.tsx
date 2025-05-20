
import React from 'react';
import SEO from './SEO';

interface ContactPageSEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

/**
 * SEO component for the Contact page
 */
const ContactPageSEO: React.FC<ContactPageSEOProps> = ({
  title = "Contact Us | Applestone Solutions",
  description = "Get in touch with our team to learn more about our vending solutions and how we can help your business.",
  canonicalUrl = "https://applestonesolutions.com/contact"
}) => {
  // Generate structured data for the contact page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Applestone Solutions',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+1-555-123-4567',
        'contactType': 'customer service',
        'areaServed': 'US',
        'availableLanguage': 'English'
      }
    }
  };

  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      type="website"
      openGraph={{
        title,
        description,
        url: canonicalUrl,
        type: 'website'
      }}
      schema={structuredData}
    />
  );
};

export default ContactPageSEO;
