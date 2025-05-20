
import React from 'react';
import SEO from './SEO';
import { CMSProductType } from '@/types/cms';

interface ProductsPageSEOProps {
  title?: string;
  description?: string;
  products?: CMSProductType[];
  canonicalUrl?: string;
}

/**
 * SEO component specifically for the Products page
 */
const ProductsPageSEO: React.FC<ProductsPageSEOProps> = ({ 
  title = "Vending Software Products | Applestone Solutions", 
  description = "Discover our complete line of vending machine software products designed for modern vending operations.",
  products,
  canonicalUrl 
}) => {
  // Generate the URL for the current page
  const pageUrl = typeof window !== 'undefined' 
    ? canonicalUrl || window.location.href
    : 'https://applestonesolutions.com/products';
  
  // Generate structured data for the products listing
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': products ? products.map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'SoftwareApplication',
        'name': product.title,
        'description': product.description,
        'url': `${pageUrl}/${product.slug}`,
        'applicationCategory': 'BusinessApplication',
        ...(product.image && {
          image: product.image.url
        })
      }
    })) : []
  };

  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={pageUrl}
      type="website"
      openGraph={{
        title: title,
        description: description,
        url: pageUrl,
        type: 'website'
      }}
      twitter={{
        card: 'summary_large_image'
      }}
      schema={structuredData}
    />
  );
};

export default ProductsPageSEO;
