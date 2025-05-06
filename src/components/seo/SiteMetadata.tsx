
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SiteMetadataProps {
  siteUrl?: string;
  organization?: {
    name: string;
    logo: string;
    sameAs?: string[];
  };
}

/**
 * Global site metadata component that adds structured data for the website and organization
 */
const SiteMetadata: React.FC<SiteMetadataProps> = ({
  siteUrl = 'https://applestonesolutions.com',
  organization = {
    name: 'Applestone Solutions',
    logo: 'https://applestonesolutions.com/logo.png',
    sameAs: [
      'https://www.linkedin.com/company/applestone-solutions',
      'https://twitter.com/applestonesols'
    ]
  }
}) => {
  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': organization.name,
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
  
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': organization.name,
    'url': siteUrl,
    'logo': organization.logo,
    ...(organization.sameAs && { 'sameAs': organization.sameAs })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SiteMetadata;
