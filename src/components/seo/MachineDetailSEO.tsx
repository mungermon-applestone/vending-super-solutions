
import React from 'react';
import SEO from './SEO';
import { CMSMachine } from '@/types/cms';

interface MachineDetailSEOProps {
  machine: CMSMachine;
  canonicalUrl?: string;
}

/**
 * SEO component specifically for Machine detail pages
 */
const MachineDetailSEO: React.FC<MachineDetailSEOProps> = ({ machine, canonicalUrl }) => {
  // Generate the URL for the current page
  const pageUrl = typeof window !== 'undefined' 
    ? canonicalUrl || window.location.href
    : `https://applestonesolutions.com/machines/${machine.slug}`;
  
  // Get the main image URL if available
  const mainImageUrl = machine.images && machine.images.length > 0 
    ? machine.images[0].url 
    : undefined;
  
  // Generate structured data for the machine
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': machine.title,
    'description': machine.description,
    'url': pageUrl,
    ...(mainImageUrl && {
      image: mainImageUrl
    }),
    ...(machine.specs && Object.keys(machine.specs).length > 0 && {
      'additionalProperty': Object.entries(machine.specs).map(([name, value]) => ({
        '@type': 'PropertyValue',
        'name': name,
        'value': value
      }))
    })
  };

  return (
    <SEO
      title={machine.title}
      description={machine.description}
      canonicalUrl={pageUrl}
      image={mainImageUrl}
      type="product"
      openGraph={{
        title: machine.title,
        description: machine.description,
        url: pageUrl,
        type: 'product',
        image: mainImageUrl
      }}
      twitter={{
        card: 'summary_large_image',
        image: mainImageUrl
      }}
      schema={structuredData}
    />
  );
};

export default MachineDetailSEO;
