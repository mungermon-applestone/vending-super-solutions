
/**
 * CMS configuration and utility functions
 */

/**
 * Whether Contentful is configured with environment variables
 */
export function isContentfulConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_CONTENTFUL_SPACE_ID && 
    import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN
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
  return import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
}

/**
 * Get the Contentful Environment ID
 */
export function getContentfulEnvironmentId(): string {
  return import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
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
  
  // Fallback to Strapi (legacy provider)
  return CMSProvider.STRAPI;
}
