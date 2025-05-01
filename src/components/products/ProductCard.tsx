
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/common/Image';
import { CMSProductType } from '@/types/cms';

interface ProductCardProps {
  product: CMSProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  // Extract the slug but ensure it's valid
  const productSlug = product?.slug || '';
  
  // Determine which image to use - thumbnail has priority over main image
  const imageToUse = product.thumbnail || product.image;
  
  // Add logging to track product data
  console.log(`[ProductCard] Rendering card for: ${product.title}`, {
    id: product.id,
    slug: productSlug,
    hasImage: !!imageToUse,
    hasThumbnail: !!product.thumbnail,
    imageSource: product.thumbnail ? 'thumbnail' : (product.image ? 'main image' : 'none')
  });
  
  return (
    <article 
      className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow"
      itemScope 
      itemType="https://schema.org/Product"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="w-full h-48 overflow-hidden bg-gray-100">
        {imageToUse ? (
          <Image 
            src={imageToUse.url} 
            alt={imageToUse.alt || product.title}
            className="w-full h-full" 
            objectFit="contain"
            isThumbnail={!!product.thumbnail}
            itemProp="image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 
          id={`product-title-${product.id}`}
          className="text-xl font-semibold mb-3" 
          itemProp="name"
        >
          {product.title}
        </h3>
        <p 
          className="text-gray-600 mb-4 line-clamp-3" 
          itemProp="description"
        >
          {product.description}
        </p>
        <meta itemProp="brand" content="Vending Solutions" />
        <meta itemProp="category" content="Vending Machine Products" />
        <Button 
          variant="ghost" 
          className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
          onClick={() => {
            console.log(`[ProductCard] Navigating to product: ${productSlug}`);
            navigate(`/products/${productSlug}`);
          }}
          aria-label={`Learn more about ${product.title}`}
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
