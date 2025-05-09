
import { ContentProviderConfig, ContentProviderType } from '../types';
import { ProductAdapter } from './types';
import { contentfulProductAdapter } from './contentfulProductAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function to get the appropriate product adapter based on configuration
 */
export const getProductAdapter = (config?: ContentProviderConfig): ProductAdapter => {
  try {
    // Always use Contentful adapter regardless of config
    console.log('[productAdapterFactory] Using Contentful product adapter');
    return contentfulProductAdapter;
  } catch (error) {
    console.error('[productAdapterFactory] Error creating product adapter:', error);
    throw handleCMSError(error, 'initialize', 'ProductAdapter');
  }
};

/**
 * Check if the configured CMS provider has a valid product adapter
 * @param config The CMS provider configuration to check
 * @returns True if the adapter is available and valid
 */
export async function validateProductAdapter(config: ContentProviderConfig): Promise<boolean> {
  try {
    const adapter = getProductAdapter(config);
    
    // Try a simple operation to validate the adapter
    await adapter.getAll({ limit: 1 });
    
    return true;
  } catch (error) {
    console.error('[validateProductAdapter] Validation failed:', error);
    return false;
  }
}
