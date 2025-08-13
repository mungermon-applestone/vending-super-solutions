/**
 * Utilities for generating Contentful URLs
 */

import { getContentfulConfig } from '@/services/cms/utils/cmsInfo';

/**
 * Generate a direct link to edit a Contentful entry
 * @param entryId - The Contentful entry ID
 * @returns Promise<string> - The direct edit URL
 */
export async function getContentfulEditUrl(entryId: string): Promise<string> {
  const config = await getContentfulConfig();
  
  if (!config.space_id) {
    console.warn('Contentful Space ID not found in environment variables');
    return 'https://app.contentful.com/';
  }
  
  const spaceId = config.space_id;
  const environmentId = config.environment_id || 'master';
  
  // Contentful edit URL format: https://app.contentful.com/spaces/{SPACE_ID}/environments/{ENVIRONMENT_ID}/entries/{ENTRY_ID}
  return `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
}

/**
 * Generate a sync function that opens Contentful edit URL in new tab
 * @param entryId - The Contentful entry ID
 * @returns Function that opens the edit URL
 */
export function createContentfulEditHandler(entryId: string) {
  return async () => {
    try {
      const editUrl = await getContentfulEditUrl(entryId);
      window.open(editUrl, '_blank');
    } catch (error) {
      console.error('Failed to open Contentful edit URL:', error);
      // Fallback to Contentful home page
      window.open('https://app.contentful.com/', '_blank');
    }
  };
}