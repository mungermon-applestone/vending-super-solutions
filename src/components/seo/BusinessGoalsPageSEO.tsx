
import React from 'react';
import SEO from './SEO';
import { CMSBusinessGoal } from '@/types/cms';

interface BusinessGoalsPageSEOProps {
  businessGoals?: CMSBusinessGoal[];
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

/**
 * SEO component for the Business Goals listing page
 */
const BusinessGoalsPageSEO: React.FC<BusinessGoalsPageSEOProps> = ({
  businessGoals,
  title = "Business Goals | Applestone Solutions",
  description = "Discover how our vending solutions can help you achieve your business goals.",
  canonicalUrl = "https://applestonesolutions.com/business-goals"
}) => {
  // Generate structured data for the business goals list
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': businessGoals ? businessGoals.map((goal, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Service',
        'name': goal.title,
        'description': goal.description,
        'url': `https://applestonesolutions.com/business-goals/${goal.slug}`,
        ...(goal.image && { image: goal.image.url })
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

export default BusinessGoalsPageSEO;
