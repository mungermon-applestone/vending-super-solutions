
import React from 'react';
import SEO from './SEO';
import { CMSMachine } from '@/types/cms';

interface MachinesPageSEOProps {
  machines?: CMSMachine[];
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

/**
 * SEO component for the Machines listing page
 */
const MachinesPageSEO: React.FC<MachinesPageSEOProps> = ({
  machines,
  title = "Vending Machines | Applestone Solutions",
  description = "Explore our range of innovative vending machines designed for modern retail operations.",
  canonicalUrl = "https://applestonesolutions.com/machines"
}) => {
  // Generate structured data for the machines list
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': machines ? machines.map((machine, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': machine.title,
        'description': machine.description,
        'url': `https://applestonesolutions.com/machines/${machine.slug}`,
        ...(machine.image && { image: machine.image.url })
      }
    })) : []
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
      twitter={{
        card: 'summary_large_image'
      }}
      schema={structuredData}
    />
  );
};

export default MachinesPageSEO;
