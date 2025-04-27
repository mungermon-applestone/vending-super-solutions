
import React from 'react';
import { CMSProductType } from '@/types/cms';
import ProductCard from '@/components/products/ProductCard';
import ProductsSchemaData from '@/components/products/ProductsSchemaData';
import { useLocation } from 'react-router-dom';

interface ProductGridProps {
  products: CMSProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const location = useLocation();
  const currentUrl = `https://yourdomain.com${location.pathname}`;
  
  // Create breadcrumb items for schema
  const breadcrumbItems = [
    {
      name: "Home",
      url: "https://yourdomain.com",
      position: 1
    },
    {
      name: "Products",
      url: currentUrl,
      position: 2
    }
  ];

  return (
    <>
      <ProductsSchemaData 
        products={products} 
        breadcrumbItems={breadcrumbItems}
      />
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        role="list" 
        aria-label="Products list"
      >
        {products.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
