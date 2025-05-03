
import React from 'react';
import { CMSProductType } from '@/types/cms';
import ProductCard from '@/components/products/ProductCard';
import ProductsSchemaData from '@/components/products/ProductsSchemaData';
import { useLocation } from 'react-router-dom';
import ProductsLoadingState from '@/components/products/sections/ProductsLoadingState';

interface ProductGridProps {
  products: CMSProductType[];
  isHomepage?: boolean;
  isLoading?: boolean;
}

const ProductGrid = ({ products, isHomepage = false, isLoading = false }: ProductGridProps) => {
  const location = useLocation();
  const currentUrl = `https://applestonesolutions.com${location.pathname}`;
  
  // Sort products if they have ordering properties - memoize to prevent recomputing on each render
  const sortedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
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

  // If loading, show loading state
  if (isLoading) {
    return <ProductsLoadingState />;
  }

  // Use IntersectionObserver to load cards as they come into view
  const [visibleCards, setVisibleCards] = React.useState<Record<string, boolean>>({});
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    // Create IntersectionObserver to track when product cards enter viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updatedCards: Record<string, boolean> = { ...visibleCards };
        
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-product-id');
          if (id) {
            updatedCards[id] = entry.isIntersecting || visibleCards[id] || false;
          }
        });
        
        setVisibleCards(updatedCards);
      },
      { rootMargin: '100px 0px', threshold: 0.1 }
    );

    // Return cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleCards]);

  // Register each product card with the IntersectionObserver
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  
  React.useEffect(() => {
    if (observerRef.current) {
      Object.values(cardRefs.current).forEach(ref => {
        if (ref) {
          observerRef.current?.observe(ref);
        }
      });
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sortedProducts]);

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
          <div 
            key={product.id} 
            role="listitem"
            data-product-id={product.id}
            ref={el => cardRefs.current[product.id] = el}
          >
            <ProductCard 
              product={product} 
              isVisible={visibleCards[product.id] || false}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
