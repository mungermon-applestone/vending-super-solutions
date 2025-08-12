/**
 * Contentful Preview API client for draft content
 */

import { createClient } from 'contentful';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let previewClientInstance: any = null;

/**
 * Get or create preview client instance
 */
async function getPreviewClient() {
  if (!previewClientInstance) {
    try {
      // Get config from our edge function
      const supabase = createSupabaseClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase.functions.invoke('get-contentful-config');
      
      if (error) {
        console.error('[Preview Client] Failed to get config from edge function:', error);
        throw new Error('Failed to get Contentful configuration');
      }
      
      if (!data.VITE_CONTENTFUL_PREVIEW_TOKEN) {
        throw new Error('Missing Contentful Preview Token in configuration');
      }
      
      previewClientInstance = createClient({
        space: data.VITE_CONTENTFUL_SPACE_ID || '',
        accessToken: data.VITE_CONTENTFUL_PREVIEW_TOKEN,
        environment: data.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
        host: 'preview.contentful.com', // Preview API endpoint
      });
      
      console.log('[Preview Client] Successfully created preview client');
    } catch (error) {
      console.error('[Preview Client] Error creating client:', error);
      throw error;
    }
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