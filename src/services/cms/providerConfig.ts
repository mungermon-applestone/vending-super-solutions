
import { ContentProviderConfig, ContentProviderType } from './adapters/types';
import { logDeprecationWarning } from './utils/deprecationLogger';

/**
 * Default content provider configuration - always use Contentful now
 */
const currentProviderConfig: ContentProviderConfig = {
  type: ContentProviderType.CONTENTFUL
};

/**
 * Get the current content provider configuration
 * Always returns Contentful configuration regardless of previous settings
 */
export const getCMSProviderConfig = (): ContentProviderConfig => {
  return { type: ContentProviderType.CONTENTFUL };
};

/**
 * Set the content provider configuration
 * @deprecated This function is deprecated as we now always use Contentful
 * @param config New configuration (will be ignored)
 */
export const setCMSProviderConfig = (config: ContentProviderConfig) => {
  logDeprecationWarning(
    "setCMSProviderConfig",
    "Setting a non-Contentful provider is deprecated and will be ignored.",
    "Contentful is now the only supported CMS provider."
  );
  
  // Log but ignore the attempt to change provider
  console.log('[providerConfig] Attempted to change CMS provider, but Contentful is now enforced');
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
