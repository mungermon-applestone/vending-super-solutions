
import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';

const AdminControls = () => {
  const { productType } = useParams();
  const location = useLocation();
  
  // Determine if we're on a product detail page by checking both the path pattern
  // and if productType is defined
  const isProductDetailPage = location.pathname.includes('/products/') && !!productType;
  
  console.log("AdminControls rendering with:", {
    location: location.pathname,
    productType,
    isProductDetailPage
  });

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      {isProductDetailPage ? (
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg">
          <Link to={`/admin/products/edit/${productType}`} className="flex items-center gap-2">
            <Edit size={16} /> Edit Product
          </Link>
        </Button>
      ) : (
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg">
          <Link to="/admin/products/new" className="flex items-center gap-2">
            <PlusCircle size={16} /> New Product
          </Link>
        </Button>
      )}
    </div>
  );
};

export default AdminControls;
