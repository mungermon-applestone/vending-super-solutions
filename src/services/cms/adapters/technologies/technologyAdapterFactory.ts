
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { strapiTechnologyAdapter } from './strapi';
import { supabaseTechnologyAdapter } from './supabase';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function to get the appropriate technology adapter based on the CMS provider
 * @param config CMS provider configuration
 * @returns The appropriate technology adapter implementation
 */
export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  try {
    switch (config.type) {
      case ContentProviderType.STRAPI:
        console.log('[technologyAdapterFactory] Using Strapi technology adapter');
        return strapiTechnologyAdapter;
      
      case ContentProviderType.SUPABASE:
      default:
        console.log('[technologyAdapterFactory] Using Supabase technology adapter');
        return supabaseTechnologyAdapter;
    }
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    throw handleCMSError(error, 'initialize', 'TechnologyAdapter');
  }
}

/**
 * Check if the configured CMS provider has a valid technology adapter
 * @param config The CMS provider configuration to check
 * @returns True if the adapter is available and valid
 */
export async function validateTechnologyAdapter(config: ContentProviderConfig): Promise<boolean> {
  try {
    const adapter = getTechnologyAdapter(config);
    
    // Try a simple operation to validate the adapter
    await adapter.getAll({ limit: 1 });
    
    return true;
  } catch (error) {
    console.error('[validateTechnologyAdapter] Validation failed:', error);
    return false;
  }
}

