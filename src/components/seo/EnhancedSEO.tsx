
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  preloadAssets?: string[];
  noindex?: boolean;
}

/**
 * EnhancedSEO component improves SEO and performance with optimized meta tags
 * and resource hints
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title = 'Vending Solutions | Applestone Solutions',
  description = 'Advanced vending machine solutions for modern businesses by Applestone Solutions',
  canonicalUrl,
  preloadAssets = [],
  noindex = false
}) => {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Performance optimization with resource hints */}
      {preloadAssets.map((asset, index) => (
        <link 
          key={`preload-${index}`} 
          rel="preload" 
          href={asset} 
          as={asset.endsWith('.js') ? 'script' : asset.endsWith('.css') ? 'style' : 'image'} 
        />
      ))}
      
      {/* Security headers */}
      <meta httpEquiv="Content-Security-Policy-Report-Only" content="default-src 'self'; img-src 'self' https://images.ctfassets.net data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdn.contentful.com" />
      
      {/* SEO controls */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* PWA support */}
      <meta name="theme-color" content="#2563eb" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default EnhancedSEO;
