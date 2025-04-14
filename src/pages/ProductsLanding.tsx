
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

const ProductsLanding: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the database-driven products page
    navigate('/products');
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-2" />
        <span>Redirecting to products...</span>
      </div>
    </Layout>
  );
};

export default ProductsLanding;
