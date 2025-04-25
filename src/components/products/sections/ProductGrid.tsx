
import React from 'react';
import { CMSProductType } from '@/types/cms';
import ProductCard from '@/components/products/ProductCard';

interface ProductGridProps {
  products: CMSProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
