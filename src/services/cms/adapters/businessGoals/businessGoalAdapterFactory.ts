
import { ContentProviderConfig, ContentProviderType } from '../types';
import { BusinessGoalAdapter } from './types';
import { contentfulBusinessGoalAdapter } from './contentfulBusinessGoalAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function that returns the Contentful business goal adapter
 * regardless of configuration
 */
export const getBusinessGoalAdapter = (config?: ContentProviderConfig): BusinessGoalAdapter => {
  try {
    console.log('[businessGoalAdapterFactory] Using Contentful business goal adapter');
    return contentfulBusinessGoalAdapter;
  } catch (error) {
    console.error('[businessGoalAdapterFactory] Error creating business goal adapter:', error);
    throw handleCMSError(error, 'initialize', 'BusinessGoalAdapter');
  }
};

/**
 * Check if the business goal adapter is valid
 * @returns True if the adapter is available and valid
 */
export async function validateBusinessGoalAdapter(config: ContentProviderConfig): Promise<boolean> {
  try {
    const adapter = getBusinessGoalAdapter(config);
    
    // Try a simple operation to validate the adapter
    await adapter.getAll({ limit: 1 });
    
    return true;
  } catch (error) {
    console.error('[validateBusinessGoalAdapter] Validation failed:', error);
    return false;
  }
}
