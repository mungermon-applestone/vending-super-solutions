/**
 * Contentful Preview API client for draft content
 */

import { createClient } from 'contentful';
import { getContentfulConfig } from '@/config/cms';

let previewClientInstance: any = null;

/**
 * Get or create preview client instance
 */
async function getPreviewClient() {
  if (!previewClientInstance) {
    const config = await getContentfulConfig();
    
    if (!config.PREVIEW_TOKEN) {
      throw new Error('Missing Contentful Preview Token in configuration');
    }
    
    previewClientInstance = createClient({
      space: config.SPACE_ID || '',
      accessToken: config.PREVIEW_TOKEN,
      environment: config.ENVIRONMENT_ID || 'master',
      host: 'preview.contentful.com', // Preview API endpoint
    });
  }
  
  return previewClientInstance;
}

/**
 * Preview client for accessing draft content
 */
export const contentfulPreviewClient = {
  async getEntries(query?: any) {
    const client = await getPreviewClient();
    return client.getEntries(query);
  },
  
  async getEntry(id: string, query?: any) {
    const client = await getPreviewClient();
    return client.getEntry(id, query);
  }
};

/**
 * Test preview client connection
 */
export async function testPreviewConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const client = await getPreviewClient();
    await client.getEntries({ limit: 1 });
    
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