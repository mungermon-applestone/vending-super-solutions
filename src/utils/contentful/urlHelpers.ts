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
  
  console.log('[getContentfulEditUrl] Debug info:', {
    entryId,
    spaceId: config.space_id,
    environmentId: config.environment_id,
    hasSpaceId: !!config.space_id
  });
  
  if (!config.space_id) {
    console.warn('Contentful Space ID not found in environment variables');
    return 'https://app.contentful.com/';
  }
  
  const spaceId = config.space_id;
  const environmentId = config.environment_id || 'master';
  
  // Contentful edit URL format - corrected to include the /editor suffix
  const editUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}/editor`;
  
  console.log('[getContentfulEditUrl] Generated URL:', editUrl);
  
  return editUrl;
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