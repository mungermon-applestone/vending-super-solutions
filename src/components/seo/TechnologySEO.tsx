
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
  
  // Handle various image formats - could be a string or an object
  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.url) return image.url;
    return undefined;
  };
  
  const imageUrl = getImageUrl(technology.image);
  
  // Generate structured data for the technology
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': technology.title,
    'description': technology.description,
    'url': pageUrl,
    'applicationCategory': 'BusinessApplication',
    ...(imageUrl && {
      image: imageUrl
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
      image={imageUrl}
      type="website"
      openGraph={{
        title: technology.title,
        description: technology.description,
        url: pageUrl,
        type: 'website',
        image: imageUrl
      }}
      twitter={{
        card: 'summary_large_image',
        image: imageUrl
      }}
      schema={structuredData}
    />
  );
};

export default TechnologySEO;
