
import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  normalizeSlug, 
  mapUrlSlugToDatabaseSlug, 
  parseSlugWithUUID,
  extractUUID
} from '@/services/cms/utils/slugMatching';

/**
 * Custom hook to extract the product type from URL parameters or path
 * Supports both traditional slugs and UUID-enhanced slugs
 * @returns The product type extracted from the URL and UUID if available
 */
export const useProductTypeFromUrl = () => {
  const params = useParams<{ productType: string; id: string }>();
  const location = useLocation();

  const productInfo = useMemo(() => {
    // First priority: Check URL params for 'productType'
    if (params.productType) {
      console.log("[useProductTypeFromUrl] Using productType from URL params:", params.productType);
      
      // Parse the combined slug if it contains UUID
      const { baseSlug, uuid } = parseSlugWithUUID(params.productType);
      console.log(`[useProductTypeFromUrl] Parsed slug: "${baseSlug || 'none'}", UUID: "${uuid || 'none'}"`);
      
      return { 
        slug: normalizeSlug(baseSlug || params.productType),
        uuid 
      };
    }
    
    // Check for 'id' param (used in new routes)
    if (params.id) {
      console.log("[useProductTypeFromUrl] Using id from URL params:", params.id);
      
      // Parse the combined slug if it contains UUID
      const { baseSlug, uuid } = parseSlugWithUUID(params.id);
      console.log(`[useProductTypeFromUrl] Parsed slug: "${baseSlug || 'none'}", UUID: "${uuid || 'none'}"`);
      
      return { 
        slug: normalizeSlug(baseSlug || params.id),
        uuid 
      };
    }
    
    // Second priority: Extract from path for product pages
    // This specifically targets URLs like /products/grocery or /products/grocery--uuid
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'products') {
      const productTypeFromPath = pathParts[2];
      console.log("[useProductTypeFromUrl] Extracted product type from products path:", productTypeFromPath);
      
      // Parse the combined slug if it contains UUID
      const { baseSlug, uuid } = parseSlugWithUUID(productTypeFromPath);
      console.log(`[useProductTypeFromUrl] Parsed slug: "${baseSlug || 'none'}", UUID: "${uuid || 'none'}"`);
      
      const normalizedSlug = normalizeSlug(baseSlug || productTypeFromPath);
      const mappedSlug = mapUrlSlugToDatabaseSlug(normalizedSlug);
      
      console.log("[useProductTypeFromUrl] Normalized slug:", normalizedSlug);
      console.log("[useProductTypeFromUrl] Database mapped slug:", mappedSlug);
      
      return { 
        slug: normalizedSlug,
        uuid 
      };
    }

    // Third priority: Check if we're on an edit page
    if (location.pathname.includes('/admin/products/edit/') || 
        location.pathname.includes('/admin/product-types/edit/')) {
      
      const editPathParts = location.pathname.split('/');
      const lastPathPart = editPathParts[editPathParts.length - 1];
      
      if (lastPathPart) {
        console.log("[useProductTypeFromUrl] Using productType from edit path:", lastPathPart);
        
        // Check if it's a UUID directly or a slug--uuid format
        const uuid = extractUUID(lastPathPart);
        
        if (uuid) {
          return {
            slug: normalizeSlug(lastPathPart.replace(uuid, '').replace('--', '')),
            uuid
          };
        }
        
        return { 
          slug: normalizeSlug(lastPathPart),
          uuid: null
        };
      }
    }

    // Fallback
    console.log("[useProductTypeFromUrl] No productType found in URL, using default empty string");
    return { 
      slug: '',
      uuid: null 
    };
  }, [params.productType, params.id, location.pathname]);

  // Add effect to log URL changes
  useEffect(() => {
    console.log("[useProductTypeFromUrl] URL changed:", location.pathname);
    console.log("[useProductTypeFromUrl] Extracted product info:", productInfo);
  }, [location.pathname, productInfo]);

  return productInfo;
};
