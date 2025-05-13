import { CMSProvider, forceCMSProvider } from '@/config/cms';

/**
 * Force Contentful as the CMS provider
 * Used by components that specifically need Contentful integration
 */
export function forceContentfulProvider(): void {
  forceCMSProvider(CMSProvider.CONTENTFUL);
}

/**
 * Force Strapi as the CMS provider (legacy)
 */
export function forceStrapiProvider(): void {
  forceCMSProvider(CMSProvider.STRAPI);
}

/**
 * Force Supabase as the CMS provider
 */
export function forceSupabaseProvider(): void {
  forceCMSProvider(CMSProvider.SUPABASE);
}

/**
 * Initialize the CMS
 * Call this on app startup
 */
export function initializeCMS(): void {
  console.log('[CMS] Initializing CMS services...');
  
  // Any setup code that needs to run on app startup
  
  console.log('[CMS] CMS services initialized successfully');
}
