
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  additionalMetaTags?: Array<{ name: string; content: string }>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  image,
  type = 'website',
  noindex = false,
  openGraph,
  twitter,
  additionalMetaTags = []
}) => {
  const siteName = 'Vending Solutions';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Advanced vending solutions for modern businesses. Automate your retail operations with smart vending machines and IoT technology.';
  const defaultImage = '/og-image.jpg'; // Fallback Open Graph image
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={openGraph?.title || fullTitle} />
      <meta property="og:description" content={openGraph?.description || description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={openGraph?.image || image || defaultImage} />
      {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitter?.card || "summary_large_image"} />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {(image || defaultImage) && <meta name="twitter:image" content={image || defaultImage} />}

      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
    </Helmet>
  );
};

export default SEO;
