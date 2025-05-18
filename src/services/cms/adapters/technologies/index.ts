
import { ProviderConfig } from '../types';
import { TechnologyAdapter } from './types';
import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Returns the Contentful technology adapter
 * This simplification always returns the Contentful implementation
 */
export function getTechnologyAdapter(_config?: ProviderConfig): TechnologyAdapter {
  try {
    return contentfulTechnologyAdapter;
  } catch (error) {
    console.error('[getTechnologyAdapter] Error creating technology adapter:', error);
    throw handleCMSError(error, 'initialize', 'TechnologyAdapter');
  }
}

// Export the adapter directly for convenience
export { contentfulTechnologyAdapter };
