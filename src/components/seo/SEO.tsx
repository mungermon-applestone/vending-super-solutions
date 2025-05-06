
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
    type?: string;
    locale?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    image?: string;
  };
  additionalMetaTags?: Array<{ name: string; content: string }>;
  schema?: object;
  language?: string;
  alternateLanguages?: Array<{ hrefLang: string; href: string }>;
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
  additionalMetaTags = [],
  schema,
  language = 'en',
  alternateLanguages = []
}) => {
  const siteName = 'Applestone Solutions';
  const defaultDescription = 'Advanced vending solutions for modern businesses. Automate your retail operations with smart vending machines and IoT technology.';
  const defaultImage = '/og-image.jpg';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonical = canonicalUrl || currentUrl;

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={openGraph?.title || fullTitle} />
      <meta property="og:description" content={openGraph?.description || description || defaultDescription} />
      <meta property="og:type" content={openGraph?.type || type} />
      <meta property="og:image" content={openGraph?.image || image || defaultImage} />
      <meta property="og:url" content={openGraph?.url || canonical} />
      <meta property="og:locale" content={openGraph?.locale || 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitter?.card || "summary_large_image"} />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={twitter?.image || image || defaultImage} />

      {/* Alternate Language Links */}
      {alternateLanguages.map((lang, i) => (
        <link key={i} rel="alternate" hrefLang={lang.hrefLang} href={lang.href} />
      ))}

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#ffffff" />
      {additionalMetaTags.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
