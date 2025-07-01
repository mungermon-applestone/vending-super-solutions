
import React from 'react';
import { Link } from 'react-router-dom';
import Image from '@/components/common/Image';
import { CMSProductType } from '@/types/cms';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: CMSProductType;
  isVisible?: boolean;
}

/**
 * ProductCard Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This card is used throughout the site to display product types consistently
 * - Maintains fixed height with proportional image area (h-48) and content area
 * - Contains structured data markup (Schema.org) for SEO which must be preserved
 * - Image handling includes loading states, error states, and lazy loading
 * - Consistent hover effects and shadow styling must be maintained
 * - Entire card is now clickable (not just the "Learn more" button)
 * 
 * Layout specifications:
 * - Card uses consistent rounded corners (rounded-lg) 
 * - Shadow styling that enhances on hover (shadow-md hover:shadow-lg)
 * - Image area maintains fixed height (h-48) with object-contain styling
 * - Content area has consistent padding (p-6) and spacing
 * - Entire card acts as navigation link with proper hover states
 * 
 * @param props Component properties
 * @returns React component with Schema.org structured data
 */
const ProductCard = ({ product, isVisible = true }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  
  // Guard against null or undefined product
  if (!product) {
    console.error('[ProductCard] Received null or undefined product');
    return (
      <article className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Product data missing</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3">Product Unavailable</h3>
          <p className="text-gray-600 mb-4">This product could not be loaded.</p>
        </div>
      </article>
    );
  }
  
  // Safely extract the slug
  const productSlug = product?.slug || '';
  
  // Determine which image to use - thumbnail has priority over main image
  const imageToUse = product.thumbnail || product.image;

  // If no slug, render non-clickable card
  if (!productSlug) {
    console.error(`[ProductCard] Cannot navigate: product slug is empty for ${product.title}`);
    return (
      <article 
        className="rounded-lg overflow-hidden shadow-md bg-white h-full flex flex-col"
        itemScope 
        itemType="https://schema.org/Product"
        aria-labelledby={`product-title-${product.id}`}
      >
        {/* Image area - fixed height and consistent styling */}
        <div className="w-full h-48 overflow-hidden bg-gray-100 relative flex items-center justify-center">
          {imageToUse ? (
            <>
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full absolute" />
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <Image 
                  src={imageToUse.url} 
                  alt={imageToUse.alt || product.title}
                  className="w-full h-full"
                  objectFit="contain"
                  isThumbnail={!!product.thumbnail}
                  itemProp="image"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error(`[ProductCard] Failed to load image for: ${product.title}`);
                    setImageError(true);
                  }}
                  loading="lazy"
                  fetchPriority={isVisible ? "high" : "low"}
                />
              </div>
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400">Image not available</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        {/* Content area - consistent padding and spacing */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 
            id={`product-title-${product.id}`}
            className="text-xl font-semibold mb-3" 
            itemProp="name"
          >
            {product.title}
          </h3>
          <p 
            className="text-gray-600 mb-4 line-clamp-3 flex-grow" 
            itemProp="description"
          >
            {product.description}
          </p>
          
          {/* SEO structured data that must be preserved */}
          <meta itemProp="brand" content="Vending Solutions" />
          <meta itemProp="category" content="Vending Machine Products" />
        </div>
      </article>
    );
  }
  
  return (
    <Link 
      to={`/products/${productSlug}`}
      className="block h-full"
      onClick={() => window.scrollTo(0, 0)}
      aria-label={`Learn more about ${product.title}`}
    >
      <article 
        className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer hover:scale-[1.02]"
        itemScope 
        itemType="https://schema.org/Product"
        aria-labelledby={`product-title-${product.id}`}
      >
        {/* Image area - fixed height and consistent styling */}
        <div className="w-full h-48 overflow-hidden bg-gray-100 relative flex items-center justify-center">
          {imageToUse ? (
            <>
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full absolute" />
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <Image 
                  src={imageToUse.url} 
                  alt={imageToUse.alt || product.title}
                  className="w-full h-full"
                  objectFit="contain"
                  isThumbnail={!!product.thumbnail}
                  itemProp="image"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error(`[ProductCard] Failed to load image for: ${product.title}`);
                    setImageError(true);
                  }}
                  loading="lazy"
                  fetchPriority={isVisible ? "high" : "low"}
                />
              </div>
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400">Image not available</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        {/* Content area - consistent padding and spacing */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 
            id={`product-title-${product.id}`}
            className="text-xl font-semibold mb-3" 
            itemProp="name"
          >
            {product.title}
          </h3>
          <p 
            className="text-gray-600 mb-4 line-clamp-3 flex-grow" 
            itemProp="description"
          >
            {product.description}
          </p>
          
          {/* SEO structured data that must be preserved */}
          <meta itemProp="brand" content="Vending Solutions" />
          <meta itemProp="category" content="Vending Machine Products" />
        </div>
      </article>
    </Link>
  );
};

export default React.memo(ProductCard);
