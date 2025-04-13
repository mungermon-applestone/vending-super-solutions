
import { BusinessGoalAdapter } from './types';
import { ContentProviderConfig, ContentProviderType } from '../types';
import { supabaseBusinessGoalAdapter } from './supabaseBusinessGoalAdapter';
import { strapiBusinessGoalAdapter } from './strapiBusinessGoalAdapter';

/**
 * Factory function to get the appropriate business goal adapter based on configuration
 */
export const getBusinessGoalAdapter = (config?: ContentProviderConfig): BusinessGoalAdapter => {
  // Default to Supabase if no config provided
  const providerType = config?.type || ContentProviderType.SUPABASE;
  
  switch (providerType) {
    case ContentProviderType.SUPABASE:
      return supabaseBusinessGoalAdapter;
    case ContentProviderType.STRAPI:
      return strapiBusinessGoalAdapter;
    default:
      console.warn(`[businessGoalAdapterFactory] Unknown provider type: ${providerType}, falling back to Supabase`);
      return supabaseBusinessGoalAdapter;
  }
};
