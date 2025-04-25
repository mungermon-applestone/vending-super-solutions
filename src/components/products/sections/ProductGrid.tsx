
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CMSProductType } from '@/types/cms';
import Image from '@/components/common/Image';

interface ProductGridProps {
  products: CMSProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
          <div className="w-full h-48 overflow-hidden bg-gray-100">
            {product.image ? (
              <Image 
                src={product.image.url} 
                alt={product.image.alt || product.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
            <Button 
              variant="ghost" 
              className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
              onClick={() => navigate(`/products/${product.slug}`)}
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
