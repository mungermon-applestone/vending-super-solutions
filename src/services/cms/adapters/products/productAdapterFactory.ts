
import { ContentProviderConfig, ContentProviderType } from '../types';
import { ProductAdapter } from './types';
import { supabaseProductAdapter } from './supabaseProductAdapter';
import { strapiProductAdapter } from './strapiProductAdapter';

/**
 * Factory function to get the appropriate product adapter based on configuration
 */
export const getProductAdapter = (config?: ContentProviderConfig): ProductAdapter => {
  // Default to Supabase if no config provided
  const providerType = config?.type || ContentProviderType.SUPABASE;
  
  switch (providerType) {
    case ContentProviderType.SUPABASE:
      return supabaseProductAdapter;
    case ContentProviderType.STRAPI:
      return strapiProductAdapter;
    default:
      console.warn(`[productAdapterFactory] Unknown provider type: ${providerType}, falling back to Supabase`);
      return supabaseProductAdapter;
  }
};
