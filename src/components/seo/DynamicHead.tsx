
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface DynamicHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

const DynamicHead: React.FC<DynamicHeadProps> = ({
  title = 'Applestone Solutions',
  description = 'Advanced vending solutions for modern businesses. Automate your retail operations with smart vending machines and IoT technology.',
  image = '/og-image.jpg',
  type = 'website',
  canonicalUrl,
  structuredData
}) => {
  const location = useLocation();
  const domain = 'https://applestonesolutions.com';
  const path = location.pathname;
  const url = canonicalUrl || `${domain}${path}`;

  // Dynamic structured data for different page types
  const getStructuredData = () => {
    // Use custom structured data if provided
    if (structuredData) {
      return structuredData;
    }

    // Default website structured data
    const websiteData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Applestone Solutions',
      'url': domain,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${domain}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    // Organization data
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Applestone Solutions',
      'url': domain,
      'logo': `${domain}/logo.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+1-555-555-5555',
        'contactType': 'customer service'
      }
    };

    // Based on path, return appropriate structured data
    if (path === '/') {
      return [websiteData, organizationData];
    }

    if (path.startsWith('/products/')) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': title,
        'description': description,
        'image': image.startsWith('http') ? image : `${domain}${image}`,
        'brand': {
          '@type': 'Brand',
          'name': 'Applestone Solutions'
        }
      };
    }

    if (path.startsWith('/blog/')) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'image': image.startsWith('http') ? image : `${domain}${image}`,
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'author': {
          '@type': 'Organization',
          'name': 'Applestone Solutions'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Applestone Solutions',
          'logo': {
            '@type': 'ImageObject',
            'url': `${domain}/logo.png`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': url
        }
      };
    }

    // Default to organization data
    return organizationData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${domain}${image}`} />
      <meta property="og:site_name" content="Applestone Solutions" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${domain}${image}`} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default DynamicHead;
