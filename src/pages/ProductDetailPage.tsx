
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * This component has been replaced by ProductDetail.tsx
 * This is a temporary redirection component to ensure we don't have duplicate routes
 */
const ProductDetailPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.warn('ProductDetailPage is deprecated, redirecting to ProductDetail component');
    navigate('/products');
  }, [navigate]);
  
  return null;
};

export default ProductDetailPage;
