
import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export const useProductTypeFromUrl = () => {
  const params = useParams<{ productType: string }>();
  const location = useLocation();

  const productType = useMemo(() => {
    // First priority: Check URL params
    if (params.productType) {
      console.log("Using productType from URL params:", params.productType);
      return params.productType;
    }
    
    // Second priority: Extract from path
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart !== 'products') {
      console.log("Using productType extracted from path:", lastPart);
      return lastPart;
    }

    // Fallback
    console.log("No productType found in URL, using default");
    return '';
  }, [params.productType, location.pathname]);

  return productType;
};
