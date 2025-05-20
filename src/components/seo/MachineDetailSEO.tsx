
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
  
  // Generate structured data for the machine
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': machine.title,
    'description': machine.description,
    'url': pageUrl,
    ...(machine.image && {
      image: machine.image.url
    }),
    ...(machine.specifications && machine.specifications.length > 0 && {
      'additionalProperty': machine.specifications.map(spec => ({
        '@type': 'PropertyValue',
        'name': spec.name,
        'value': spec.value
      }))
    })
  };

  return (
    <SEO
      title={machine.title}
      description={machine.description}
      canonicalUrl={pageUrl}
      image={machine.image?.url}
      type="product"
      openGraph={{
        title: machine.title,
        description: machine.description,
        url: pageUrl,
        type: 'product',
        image: machine.image?.url
      }}
      twitter={{
        card: 'summary_large_image',
        image: machine.image?.url
      }}
      schema={structuredData}
    />
  );
};

export default MachineDetailSEO;
