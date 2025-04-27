
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CMSProductType } from '@/types/cms';

interface ProductsSchemaDataProps {
  products: CMSProductType[];
  organizationName?: string;
  organizationLogo?: string;
}

const ProductsSchemaData: React.FC<ProductsSchemaDataProps> = ({
  products,
  organizationName = 'Vending Solutions',
  organizationLogo = '/logo.png'
}) => {
  const schemaData = {
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

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default ProductsSchemaData;
