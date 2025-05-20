
import React from 'react';
import SEO from './SEO';
import { CMSTechnology } from '@/types/cms';

interface TechnologySEOProps {
  technology: CMSTechnology;
  canonicalUrl?: string;
}

/**
 * SEO component specifically for Technology pages
 */
const TechnologySEO: React.FC<TechnologySEOProps> = ({ technology, canonicalUrl }) => {
  // Generate the URL for the current page
  const pageUrl = typeof window !== 'undefined' 
    ? canonicalUrl || window.location.href
    : `https://applestonesolutions.com/technology/${technology.slug}`;
  
  // Generate structured data for the technology
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': technology.title,
    'description': technology.description,
    'url': pageUrl,
    'applicationCategory': 'BusinessApplication',
    ...(technology.image && {
      image: technology.image.url
    }),
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <SEO
      title={technology.title}
      description={technology.description}
      canonicalUrl={pageUrl}
      image={technology.image?.url}
      type="website"
      openGraph={{
        title: technology.title,
        description: technology.description,
        url: pageUrl,
        type: 'website',
        image: technology.image?.url
      }}
      twitter={{
        card: 'summary_large_image',
        image: technology.image?.url
      }}
      schema={structuredData}
    />
  );
};

export default TechnologySEO;
