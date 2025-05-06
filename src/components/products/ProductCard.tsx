
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/common/Image';
import { CMSProductType } from '@/types/cms';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: CMSProductType;
  isVisible?: boolean;
}

const ProductCard = ({ product, isVisible = true }: ProductCardProps) => {
  const navigate = useNavigate();
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

  // Handle the navigation to product detail page
  const handleProductNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (productSlug) {
      // Navigate to the product page and ensure we start at the top
      navigate(`/products/${productSlug}`);
      window.scrollTo(0, 0);
    } else {
      console.error(`[ProductCard] Cannot navigate: product slug is empty for ${product.title}`);
    }
  };
  
  return (
    <article 
      className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow h-full flex flex-col"
      itemScope 
      itemType="https://schema.org/Product"
      aria-labelledby={`product-title-${product.id}`}
    >
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
        <meta itemProp="brand" content="Vending Solutions" />
        <meta itemProp="category" content="Vending Machine Products" />
        <Button 
          variant="ghost" 
          className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
          onClick={handleProductNavigation}
          aria-label={`Learn more about ${product.title}`}
          disabled={!productSlug}
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
};

export default React.memo(ProductCard);
