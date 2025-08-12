/**
 * Contentful Preview API client for draft content
 */

import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';

/**
 * Preview client for accessing draft content
 */
export const contentfulPreviewClient = createClient({
  space: CONTENTFUL_CONFIG.SPACE_ID || '',
  accessToken: CONTENTFUL_CONFIG.PREVIEW_TOKEN || '',
  environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
  host: 'preview.contentful.com', // Preview API endpoint
});

/**
 * Test preview client connection
 */
export async function testPreviewConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!CONTENTFUL_CONFIG.PREVIEW_TOKEN) {
      return { 
        success: false, 
        message: 'Missing Contentful Preview Token in configuration' 
      };
    }

    await contentfulPreviewClient.getEntries({ limit: 1 });
    
    return { 
      success: true, 
      message: 'Preview API connection successful' 
    };
  } catch (error) {
    console.error('[Preview Client] Connection test failed:', error);
    return { 
      success: false, 
      message: `Preview API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}