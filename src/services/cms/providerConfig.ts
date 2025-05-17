
import { ContentProviderType } from './adapters/types';

/**
 * Get the content provider configuration - always Contentful
 */
export const getCMSProviderConfig = () => {
  return { type: ContentProviderType.CONTENTFUL };
};

/**
 * Set the content provider configuration
 * This function is kept for backward compatibility but has no effect
 */
export const setCMSProviderConfig = () => {
  console.log('[providerConfig] Contentful is now the only supported CMS provider');
};

/**
 * Check if we're using a specific provider
 * @param type Provider type to check
 * @returns true if the provider type is Contentful, false otherwise
 */
export const isUsingProvider = (type: ContentProviderType): boolean => {
  return type === ContentProviderType.CONTENTFUL;
};

// Re-export ContentProviderType for convenience
export { ContentProviderType } from './adapters/types';
