
import React from 'react';
import SEO from './SEO';
import { CMSBusinessGoal } from '@/types/cms';

interface BusinessGoalSEOProps {
  businessGoal: CMSBusinessGoal;
  canonicalUrl?: string;
}

/**
 * SEO component specifically for Business Goal pages
 */
const BusinessGoalSEO: React.FC<BusinessGoalSEOProps> = ({ businessGoal, canonicalUrl }) => {
  // Generate the URL for the current page
  const pageUrl = typeof window !== 'undefined' 
    ? canonicalUrl || window.location.href
    : `https://applestonesolutions.com/business-goals/${businessGoal.slug}`;
  
  // Generate structured data for the business goal
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: businessGoal.title,
    description: businessGoal.description,
    url: pageUrl,
    ...(businessGoal.image && {
      image: businessGoal.image.url
    })
  };

  return (
    <SEO
      title={businessGoal.title}
      description={businessGoal.description}
      canonicalUrl={pageUrl}
      image={businessGoal.image?.url}
      type="article"
      openGraph={{
        title: businessGoal.title,
        description: businessGoal.description,
        url: pageUrl,
        type: 'article',
        image: businessGoal.image?.url
      }}
      twitter={{
        card: 'summary_large_image',
        image: businessGoal.image?.url
      }}
      schema={structuredData}
    />
  );
};

export default BusinessGoalSEO;
