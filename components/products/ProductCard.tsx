
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CMSProductType } from '@/types/cms';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: CMSProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use thumbnail if available, otherwise use main image or fallback to placeholder
  const imageToUse = product.thumbnail || product.image;
  
  return (
    <article className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow h-full flex flex-col card-hover">
      <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
        {imageToUse ? (
          <Image 
            src={imageToUse.url} 
            alt={imageToUse.alt || product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3 text-[hsl(222_47%_11%)]">
          {product.title}
        </h3>
        <p className="text-[hsl(215_16%_47%)] mb-4 line-clamp-3 flex-grow">
          {product.description}
        </p>
        <Link 
          href={`/products/${product.slug}`}
          className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center"
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
