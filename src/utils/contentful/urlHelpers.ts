/**
 * Utilities for generating Contentful URLs
 */

import { CONTENTFUL_CONFIG } from '@/config/cms';

/**
 * Generate a direct link to edit a Contentful entry
 * @param entryId - The Contentful entry ID
 * @returns Promise<string> - The direct edit URL
 */
export async function getContentfulEditUrl(entryId: string): Promise<string> {
  console.log('[getContentfulEditUrl] Starting with entryId:', entryId);
  console.log('[getContentfulEditUrl] CONTENTFUL_CONFIG:', {
    SPACE_ID: CONTENTFUL_CONFIG.SPACE_ID,
    ENVIRONMENT_ID: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });
  
  if (!CONTENTFUL_CONFIG.SPACE_ID) {
    console.warn('Contentful Space ID not found in CONTENTFUL_CONFIG');
    return 'https://app.contentful.com/';
  }
  
  const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
  const environmentId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
  
  // Contentful edit URL format - try without /editor suffix first
  const editUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
  
  console.log('[getContentfulEditUrl] Generated URL:', editUrl);
  
  return editUrl;
}

/**
 * Generate a sync function that opens Contentful edit URL in new tab
 * @param entryId - The Contentful entry ID
 * @returns Function that opens the edit URL
 */
export function createContentfulEditHandler(entryId: string) {
  return () => {
    try {
      console.log('[createContentfulEditHandler] Creating handler for entryId:', entryId);
      
      if (!CONTENTFUL_CONFIG.SPACE_ID) {
        console.warn('Contentful Space ID not configured');
        window.open('https://app.contentful.com/', '_blank');
        return;
      }
      
      const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
      const environmentId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
      
      // Try the direct URL format that should work
      const editUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
      
      console.log('[createContentfulEditHandler] Opening URL:', editUrl);
      window.open(editUrl, '_blank');
    } catch (error) {
      console.error('Failed to open Contentful edit URL:', error);
      // Fallback to Contentful home page
      window.open('https://app.contentful.com/', '_blank');
    }
  };
}