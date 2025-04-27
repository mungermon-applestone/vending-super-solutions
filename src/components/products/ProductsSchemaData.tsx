
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CMSProductType } from '@/types/cms';

interface ProductsSchemaDataProps {
  products: CMSProductType[];
  organizationName?: string;
  organizationLogo?: string;
  breadcrumbItems?: Array<{name: string, url: string, position: number}>;
}

const ProductsSchemaData: React.FC<ProductsSchemaDataProps> = ({
  products,
  organizationName = 'Vending Solutions',
  organizationLogo = '/logo.png',
  breadcrumbItems
}) => {
  // Create the item list schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "image": product.image?.url,
        "brand": {
          "@type": "Brand",
          "name": organizationName
        },
        "manufacturer": {
          "@type": "Organization",
          "name": organizationName,
          "logo": organizationLogo
        }
      }
    }))
  };

  // Create breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems || [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yourdomain.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://yourdomain.com/products"
      }
    ]
  };

  // Create organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organizationName,
    "logo": organizationLogo,
    "url": "https://yourdomain.com"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default ProductsSchemaData;
