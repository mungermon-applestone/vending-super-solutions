import { ContentProviderConfig, ContentProviderType } from './adapters/types';

/**
 * Default content provider configuration - always use Contentful now
 */
let currentProviderConfig: ContentProviderConfig = {
  type: ContentProviderType.CONTENTFUL
};

/**
 * Get the current content provider configuration
 */
export const getCMSProviderConfig = (): ContentProviderConfig => {
  return currentProviderConfig;
};

/**
 * Set the content provider configuration
 * @param config New configuration
 */
export const setCMSProviderConfig = (config: ContentProviderConfig) => {
  console.log('[providerConfig] Updating CMS provider config:', config);
  currentProviderConfig = config;
};

/**
 * Check if we're using a specific provider
 */
export const isUsingProvider = (type: ContentProviderType): boolean => {
  return currentProviderConfig.type === type;
};

// Re-export ContentProviderType for convenience
export { ContentProviderType } from './adapters/types';
