
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  image,
  type = 'website',
  noindex = false,
}) => {
  const siteName = 'Vending Solutions';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Advanced vending solutions for modern businesses. Automate your retail operations with smart vending machines and IoT technology.';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
