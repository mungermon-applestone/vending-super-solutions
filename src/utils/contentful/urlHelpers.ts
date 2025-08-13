/**
 * Utilities for generating Contentful URLs
 */

import { getContentfulConfig, waitForRuntimeConfig } from '@/config/cms';

/**
 * Generate a direct link to edit a Contentful entry
 * @param entryId - The Contentful entry ID
 * @returns Promise<string> - The direct edit URL
 */
export async function getContentfulEditUrl(entryId: string): Promise<string> {
  console.log('[getContentfulEditUrl] Starting with entryId:', entryId);
  
  try {
    // Wait for runtime config to load
    await waitForRuntimeConfig();
    
    // Get the most up-to-date config
    const config = await getContentfulConfig();
    
    console.log('[getContentfulEditUrl] Config loaded:', {
      hasSpaceId: !!config.SPACE_ID,
      hasEnvironmentId: !!config.ENVIRONMENT_ID,
      spaceId: config.SPACE_ID?.substring(0, 8) + '...' // Show partial for debugging
    });
    
    if (!config.SPACE_ID) {
      console.warn('Contentful Space ID not found in config');
      return 'https://app.contentful.com/';
    }
    
    const spaceId = config.SPACE_ID;
    const environmentId = config.ENVIRONMENT_ID || 'master';
    
    // Contentful edit URL format
    const editUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
    
    console.log('[getContentfulEditUrl] Generated URL:', editUrl);
    
    return editUrl;
  } catch (error) {
    console.error('[getContentfulEditUrl] Error loading config:', error);
    return 'https://app.contentful.com/';
  }
}

/**
 * Generate an async function that opens Contentful edit URL in new tab
 * @param entryId - The Contentful entry ID
 * @returns Function that opens the edit URL
 */
export function createContentfulEditHandler(entryId: string) {
  return async () => {
    try {
      console.log('[createContentfulEditHandler] Creating handler for entryId:', entryId);
      
      const editUrl = await getContentfulEditUrl(entryId);
      console.log('[createContentfulEditHandler] Opening URL:', editUrl);
      window.open(editUrl, '_blank');
    } catch (error) {
      console.error('Failed to open Contentful edit URL:', error);
      // Fallback to Contentful home page
      window.open('https://app.contentful.com/', '_blank');
    }
  };
}