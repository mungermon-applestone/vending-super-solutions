
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { strapiTechnologyAdapter } from './strapi';
import { supabaseTechnologyAdapter } from './supabase';

/**
 * Factory function to get the appropriate technology adapter based on the CMS provider
 * @param config CMS provider configuration
 * @returns The appropriate technology adapter implementation
 */
export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  switch (config.type) {
    case ContentProviderType.STRAPI:
      console.log('[technologyAdapterFactory] Using Strapi technology adapter');
      return strapiTechnologyAdapter;
    
    case ContentProviderType.SUPABASE:
    default:
      console.log('[technologyAdapterFactory] Using Supabase technology adapter');
      return supabaseTechnologyAdapter;
  }
}
