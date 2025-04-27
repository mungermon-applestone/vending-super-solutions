
import React from 'react';
import { CMSProductType } from '@/types/cms';
import ProductCard from '@/components/products/ProductCard';
import ProductsSchemaData from '@/components/products/ProductsSchemaData';

interface ProductGridProps {
  products: CMSProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <>
      <ProductsSchemaData products={products} />
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
