
import { ContentProviderConfig, ContentProviderType } from '../types';
import { BusinessGoalAdapter } from './types';
import { contentfulBusinessGoalAdapter } from './contentfulBusinessGoalAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function to get the appropriate business goal adapter based on configuration
 */
export const getBusinessGoalAdapter = (config?: ContentProviderConfig): BusinessGoalAdapter => {
  try {
    // Default to Contentful if no config provided
    const providerType = config?.type || ContentProviderType.CONTENTFUL;
    
    switch (providerType) {
      case ContentProviderType.CONTENTFUL:
        console.log('[businessGoalAdapterFactory] Using Contentful business goal adapter');
        return contentfulBusinessGoalAdapter;
      default:
        console.log('[businessGoalAdapterFactory] No specific adapter found, using Contentful as default');
        return contentfulBusinessGoalAdapter;
    }
  } catch (error) {
    console.error('[businessGoalAdapterFactory] Error creating business goal adapter:', error);
    throw handleCMSError(error, 'initialize', 'BusinessGoalAdapter');
  }
};

/**
 * Check if the configured CMS provider has a valid business goal adapter
 * @param config The CMS provider configuration to check
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
