
/**
 * CMS configuration and utility functions
 */

/**
 * Contentful configuration
 */
export const CONTENTFUL_CONFIG = {
  // Use env variables with runtime config fallbacks
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 
           (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_SPACE_ID) || 
           '',
  
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || 
                 (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_DELIVERY_TOKEN) || 
                 '',
  
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 
                 (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_ENVIRONMENT_ID) || 
                 'master'
};

/**
 * Whether Contentful is configured with environment variables
 */
export function isContentfulConfigured(): boolean {
  return Boolean(
    CONTENTFUL_CONFIG.SPACE_ID && 
    CONTENTFUL_CONFIG.DELIVERY_TOKEN
  );
}

/**
 * Whether Contentful Management API is configured
 */
export function isContentfulManagementConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN);
}

/**
 * Get the Contentful Space ID
 */
export function getContentfulSpaceId(): string {
  return CONTENTFUL_CONFIG.SPACE_ID;
}

/**
 * Get the Contentful Environment ID
 */
export function getContentfulEnvironmentId(): string {
  return CONTENTFUL_CONFIG.ENVIRONMENT_ID;
}

/**
 * Log the current Contentful configuration (redacting tokens)
 */
export function logContentfulConfig(): void {
  console.log('[CMS] Current Contentful configuration:', {
    SPACE_ID: CONTENTFUL_CONFIG.SPACE_ID || 'Not set',
    ENVIRONMENT_ID: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'Not set',
    DELIVERY_TOKEN: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? '[REDACTED]' : 'Not set',
    isConfigured: isContentfulConfigured(),
    browserEnv: typeof window !== 'undefined' && window.env ? 'Available' : 'Not available'
  });
}

/**
 * CMS provider names
 */
export enum CMSProvider {
  CONTENTFUL = 'contentful',
  STRAPI = 'strapi',
  SUPABASE = 'supabase'
}

/**
 * Forces a specific CMS provider to be used
 */
let forcedProvider: CMSProvider | null = null;

/**
 * Force a specific CMS provider to be used
 */
export function forceCMSProvider(provider: CMSProvider): void {
  console.log(`[CMS] Forcing provider: ${provider}`);
  forcedProvider = provider;
}

/**
 * Force Contentful provider specifically
 */
export function forceContentfulProvider(): void {
  forceCMSProvider(CMSProvider.CONTENTFUL);
}

/**
 * Reset any forced CMS provider to use the default
 */
export function resetCMSProvider(): void {
  console.log('[CMS] Resetting to default provider');
  forcedProvider = null;
}

/**
 * Get the current CMS provider
 * This is the main function to determine which CMS to use
 */
export function getCurrentCMSProvider(): CMSProvider {
  // If a provider is forced, use it
  if (forcedProvider) {
    return forcedProvider;
  }
  
  // Contentful is the primary provider if configured
  if (isContentfulConfigured()) {
    return CMSProvider.CONTENTFUL;
  }
  
  // Fallback to Contentful regardless, using hardcoded/runtime configs
  return CMSProvider.CONTENTFUL;
}

/**
 * Check if we are in a preview environment
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if current URL is localhost or other dev environments
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.includes('.lovable.app') || 
         hostname.includes('-preview');
}

/**
 * Get the initialization source for Contentful
 */
export function getContentfulInitSource(): string {
  return typeof window !== 'undefined' && window._contentfulInitializedSource 
    ? window._contentfulInitializedSource 
    : 'unknown';
}
