
import { TechnologyAdapter } from './types';
import { ContentProviderConfig, ContentProviderType } from '../types';
import { supabseTechnologyAdapter } from './supabseTechnologyAdapter';
import { strapiTechnologyAdapter } from './strapiTechnologyAdapter';

/**
 * Factory function to get the appropriate technology adapter based on configuration
 */
export const getTechnologyAdapter = (config?: ContentProviderConfig): TechnologyAdapter => {
  // Default to Supabase if no config provided
  const providerType = config?.type || ContentProviderType.SUPABASE;
  
  switch (providerType) {
    case ContentProviderType.SUPABASE:
      return supabseTechnologyAdapter;
    case ContentProviderType.STRAPI:
      return strapiTechnologyAdapter;
    default:
      console.warn(`[technologyAdapterFactory] Unknown provider type: ${providerType}, falling back to Supabase`);
      return supabseTechnologyAdapter;
  }
};
