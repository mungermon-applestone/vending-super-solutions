
import { ContentProviderConfig, ContentProviderType } from '../types';
import { ProductAdapter } from './types';
import { supabaseProductAdapter } from './supabaseProductAdapter';

/**
 * Factory function to get the appropriate product adapter based on configuration
 */
export const getProductAdapter = (config?: ContentProviderConfig): ProductAdapter => {
  // Default to Supabase if no config provided
  const providerType = config?.type || ContentProviderType.SUPABASE;
  
  switch (providerType) {
    case ContentProviderType.SUPABASE:
      return supabaseProductAdapter;
    default:
      console.warn(`[productAdapterFactory] Unknown provider type: ${providerType}, falling back to Supabase`);
      return supabaseProductAdapter;
  }
};
