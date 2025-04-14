
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

/**
 * Landing page that redirects to the database-driven products page
 */
const ProductsLanding: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add some minimal delay to avoid flash of content
    const redirectTimeout = setTimeout(() => {
      console.log('[ProductsLanding] Redirecting to products page');
      navigate('/products');
    }, 300);
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-3" />
        <span className="text-gray-600">Redirecting to products...</span>
      </div>
    </Layout>
  );
};

export default ProductsLanding;
