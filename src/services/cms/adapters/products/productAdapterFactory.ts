
import { ContentProviderConfig } from '../types';
import { ProductAdapter } from './types';
import { contentfulProductAdapter } from './contentfulProductAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Factory function that always returns the Contentful product adapter
 * regardless of configuration
 */
export const getProductAdapter = (config?: ContentProviderConfig): ProductAdapter => {
  try {
    console.log('[productAdapterFactory] Using Contentful product adapter');
    return contentfulProductAdapter;
  } catch (error) {
    console.error('[productAdapterFactory] Error creating product adapter:', error);
    throw handleCMSError(error, 'initialize', 'ProductAdapter');
  }
};

/**
 * Check if the product adapter is valid
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
