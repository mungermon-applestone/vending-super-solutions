
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, List, LayoutDashboard } from 'lucide-react';
import { useProductTypeFromUrl } from '@/hooks/useProductTypeFromUrl';

const AdminControls = () => {
  const location = useLocation();
  const productInfo = useProductTypeFromUrl();
  
  // Determine page context
  const isProductDetailPage = 
    (location.pathname.includes('/products/') && 
    productInfo.slug && 
    productInfo.slug !== 'products') ||
    location.pathname.includes('/admin/products/edit/');
  
  // Determine admin page context
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminProductsPage = location.pathname === '/admin/products';
  const isProductEditPage = location.pathname.includes('/admin/products/edit/');
  
  // Don't show admin controls on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      {/* Always show Admin Dashboard link as the primary action */}
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-lg">
        <Link to="/admin" className="flex items-center gap-2">
          <LayoutDashboard size={16} /> Admin Dashboard
        </Link>
      </Button>
      
      {/* Show context-specific admin actions */}
      {isProductDetailPage && !isProductEditPage && productInfo.slug && (
        <>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-lg">
            <Link to="/admin/products" className="flex items-center gap-2">
              <List size={16} /> Manage Products
            </Link>
          </Button>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Link to={`/admin/products/edit/${productInfo.slug}`} className="flex items-center gap-2">
              <Edit size={16} /> Edit Product
            </Link>
          </Button>
        </>
      )}
      
      {/* Show New Product button only on the admin products page */}
      {isAdminProductsPage && (
        <Button asChild className="bg-green-600 hover:bg-green-700 shadow-lg">
          <Link to="/admin/products/new" className="flex items-center gap-2">
            <PlusCircle size={16} /> New Product
          </Link>
        </Button>
      )}
    </div>
  );
};

export default AdminControls;
