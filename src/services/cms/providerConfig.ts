
import { ContentProviderType } from './adapters/types';

// Define the provider config type
export interface CMSProviderConfig {
  type: ContentProviderType;
  initialized?: boolean;
  error?: string | null;
}

// Default configuration
const defaultConfig: CMSProviderConfig = {
  type: ContentProviderType.CONTENTFUL,
  initialized: false,
  error: null
};

// Current configuration
let currentConfig: CMSProviderConfig = { ...defaultConfig };

/**
 * Get the content provider configuration
 */
export const getCMSProviderConfig = (): CMSProviderConfig => {
  return currentConfig;
};

/**
 * Set the content provider configuration
 * @param config The new configuration
 */
export const setCMSProviderConfig = (config: CMSProviderConfig): void => {
  currentConfig = { ...config };
};

/**
 * Check if we're using a specific provider
 * @param type Provider type to check
 * @returns true if the provider is of the specified type
 */
export const isUsingProvider = (type: ContentProviderType): boolean => {
  return currentConfig.type === type;
};

// Re-export ContentProviderType for convenience
export { ContentProviderType } from './adapters/types';
