import React from 'react';
import { CMSProductType } from '@/types/cms';
import ProductCard from '@/components/products/ProductCard';
import ProductsSchemaData from '@/components/products/ProductsSchemaData';
import { useLocation } from 'react-router-dom';

interface ProductGridProps {
  products: CMSProductType[];
  isHomepage?: boolean;
}

const ProductGrid = ({ products, isHomepage = false }: ProductGridProps) => {
  const location = useLocation();
  const currentUrl = `https://applestonesolutions.com${location.pathname}`;
  
  // Sort products if they have ordering properties
  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    
    return [...products].sort((a, b) => {
      // For homepage, use homepageOrder
      if (isHomepage) {
        const orderA = a.homepageOrder ?? 999;
        const orderB = b.homepageOrder ?? 999;
        if (orderA !== orderB) return orderA - orderB;
      } 
      // Otherwise use displayOrder
      else {
        const orderA = a.displayOrder ?? 999;
        const orderB = b.displayOrder ?? 999;
        if (orderA !== orderB) return orderA - orderB;
      }
      
      // Fall back to title sort if orders are the same
      return a.title.localeCompare(b.title);
    });
  }, [products, isHomepage]);
  
  // Create breadcrumb items for schema
  const breadcrumbItems = [
    {
      name: "Home",
      url: "https://applestonesolutions.com",
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
        products={sortedProducts} 
        breadcrumbItems={breadcrumbItems}
      />
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        role="list" 
        aria-label="Products list"
      >
        {sortedProducts.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
