
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function to get the appropriate technology adapter based on the CMS provider
 * @param config CMS provider configuration
 * @returns The technology adapter implementation (always Contentful)
 */
export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  try {
    // Always return contentful adapter regardless of config
    console.log('[technologyAdapterFactory] Using Contentful technology adapter');
    return contentfulTechnologyAdapter;
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
