
import { ContentProviderConfig, ContentProviderType } from './adapters/types';

/**
 * Default content provider configuration
 * This can be updated at runtime to switch CMS providers
 */
let currentProviderConfig: ContentProviderConfig = {
  type: ContentProviderType.SUPABASE
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
