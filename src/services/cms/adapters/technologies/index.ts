
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { improvedTechnologyAdapter } from './improvedTechnologyAdapter';
import { strapiTechnologyAdapter } from './strapi';

/**
 * Factory function to get the appropriate technology adapter based on the CMS provider.
 * Defaults to our improved adapter for better reliability and error handling.
 * 
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
        console.log('[technologyAdapterFactory] Using Improved Supabase technology adapter');
        return improvedTechnologyAdapter;
    }
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    // Default to the improved adapter for better error handling
    return improvedTechnologyAdapter;
  }
}

// Export the improved adapter as the default implementation
export { improvedTechnologyAdapter };

// Export the factory for contexts where dynamic adapter selection is needed
export { getTechnologyAdapter };
