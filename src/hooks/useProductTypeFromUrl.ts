
import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';

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
      return normalizeSlug(params.productType);
    }
    
    // Second priority: Extract from path for product pages
    // This specifically targets URLs like /products/grocery
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'products') {
      const productTypeFromPath = pathParts[2];
      console.log("[useProductTypeFromUrl] Extracted product type from products path:", productTypeFromPath);
      return normalizeSlug(productTypeFromPath);
    }

    // Third priority: Check if we're on an edit page
    if (location.pathname.includes('/admin/products/edit/')) {
      const editPathParts = location.pathname.split('/');
      const editProductType = editPathParts[editPathParts.length - 1];
      if (editProductType) {
        console.log("[useProductTypeFromUrl] Using productType from edit path:", editProductType);
        return normalizeSlug(editProductType);
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
