
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CMSProductType } from '@/types/cms';

interface ProductGridProps {
  products: CMSProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg">
          {product.image && (
            <img 
              src={product.image.url} 
              alt={product.image.alt || product.title} 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x200?text=Product+Image";
              }}
            />
          )}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3">{product.title}</h3>
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
