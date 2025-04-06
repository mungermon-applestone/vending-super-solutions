
import { useMemo, useEffect } from 'react';
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
    const pathMatch = pathParts.find(part => part === 'products');
    if (pathMatch && pathParts.indexOf(pathMatch) + 1 < pathParts.length) {
      const productTypeFromPath = pathParts[pathParts.indexOf(pathMatch) + 1];
      console.log("[useProductTypeFromUrl] Using productType extracted from path:", productTypeFromPath);
      return productTypeFromPath;
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

  // Add effect to log URL changes
  useEffect(() => {
    console.log("[useProductTypeFromUrl] URL changed:", location.pathname);
    console.log("[useProductTypeFromUrl] Extracted product type:", productType);
  }, [location.pathname, productType]);

  return productType;
};
