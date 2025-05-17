
import { TechnologyAdapter } from './types';
import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function to get the Contentful technology adapter
 * @returns The technology adapter implementation
 */
export function getTechnologyAdapter(): TechnologyAdapter {
  try {
    console.log('[technologyAdapterFactory] Using Contentful technology adapter');
    return contentfulTechnologyAdapter;
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    throw handleCMSError(error, 'initialize', 'TechnologyAdapter');
  }
}

/**
 * Check if the technology adapter is valid
 * @returns True if the adapter is available and valid
 */
export async function validateTechnologyAdapter(): Promise<boolean> {
  try {
    const adapter = getTechnologyAdapter();
    
    // Try a simple operation to validate the adapter
    await adapter.getAll({ limit: 1 });
    
    return true;
  } catch (error) {
    console.error('[validateTechnologyAdapter] Validation failed:', error);
    return false;
  }
}
