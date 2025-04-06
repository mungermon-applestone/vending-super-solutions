
import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/**
 * Custom hook to extract the product type from URL parameters or path
 * @returns The product type extracted from the URL
 */
export const useProductTypeFromUrl = () => {
  const params = useParams<{ productType: string }>();
  const location = useLocation();

  const productType = useMemo(() => {
    // First priority: Check URL params
    if (params.productType) {
      console.log("[useProductTypeFromUrl] Using productType from URL params:", params.productType);
      return params.productType;
    }
    
    // Second priority: Extract from path
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart !== 'products') {
      console.log("[useProductTypeFromUrl] Using productType extracted from path:", lastPart);
      return lastPart;
    }

    // Third priority: Check if we're on an edit page
    if (location.pathname.includes('/admin/products/edit/')) {
      const editPathParts = location.pathname.split('/');
      const editProductType = editPathParts[editPathParts.length - 1];
      if (editProductType) {
        console.log("[useProductTypeFromUrl] Using productType from edit path:", editProductType);
        return editProductType;
      }
    }

    // Fallback
    console.log("[useProductTypeFromUrl] No productType found in URL, using default empty string");
    return '';
  }, [params.productType, location.pathname]);

  return productType;
};
