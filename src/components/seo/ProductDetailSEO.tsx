
import React from 'react';
import SEO from './SEO';
import { CMSProductType } from '@/types/cms';

interface ProductDetailSEOProps {
  product: CMSProductType;
  canonicalUrl?: string;
}

/**
 * SEO component specifically for individual product detail pages
 */
const ProductDetailSEO: React.FC<ProductDetailSEOProps> = ({ product, canonicalUrl }) => {
  // Generate page title and description
  const title = `${product.title} | Applestone Solutions`;
  const description = product.description || `Learn more about our ${product.title} vending solution`;
  
  // Generate image URL for open graph
  const imageUrl = product.image?.url || '';
  
  // Generate canonical URL
  const pageUrl = typeof window !== 'undefined' 
    ? canonicalUrl || `${window.location.origin}/products/${product.slug}`
    : `https://applestonesolutions.com/products/${product.slug}`;

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': product.title,
    'description': product.description,
    'applicationCategory': 'BusinessApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    },
    'url': pageUrl,
    ...(imageUrl && { image: imageUrl })
  };

  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={pageUrl}
      image={imageUrl}
      type="product"
      openGraph={{
        title,
        description,
        image: imageUrl,
        url: pageUrl,
        type: 'product'
      }}
      twitter={{
        card: 'summary_large_image'
      }}
      schema={structuredData}
    />
  );
};

export default ProductDetailSEO;
