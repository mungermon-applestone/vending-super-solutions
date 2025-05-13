
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';

// Create and initialize Contentful client
export const getContentfulClient = () => {
  try {
    const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;

    if (!SPACE_ID || !DELIVERY_TOKEN) {
      console.error('Contentful configuration missing. Please check your environment variables.');
      return null;
    }

    return createClient({
      space: SPACE_ID,
      accessToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT_ID || 'master'
    });
  } catch (error) {
    console.error('Error creating Contentful client:', error);
    return null;
  }
};

/**
 * Fetch entries from Contentful with proper error handling
 */
export async function fetchContentfulEntries<T = any>(
  contentType: string,
  query: Record<string, any> = {}
): Promise<Array<T>> {
  try {
    console.log(`[Contentful] Fetching entries of type "${contentType}" with query:`, query);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return [];
    }

    const response = await client.getEntries({
      content_type: contentType,
      ...query
    });

    console.log(`[Contentful] Fetched ${response.items.length} items of type "${contentType}"`);
    return response.items as unknown as Array<T>;
  } catch (error) {
    console.error(`[Contentful] Error fetching entries of type "${contentType}":`, error);
    toast.error(`Error loading content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}

/**
 * Fetch a single entry from Contentful by ID
 */
export async function fetchContentfulEntry<T = any>(id: string): Promise<T | null> {
  try {
    console.log(`[Contentful] Fetching entry with ID "${id}"`);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return null;
    }

    const entry = await client.getEntry(id);
    console.log(`[Contentful] Fetched entry with ID "${id}"`, entry);
    
    return entry as unknown as T;
  } catch (error) {
    console.error(`[Contentful] Error fetching entry with ID "${id}":`, error);
    return null;
  }
}

/**
 * Fetch assets from Contentful
 */
export async function fetchContentfulAssets(query: Record<string, any> = {}): Promise<any[]> {
  try {
    console.log('[Contentful] Fetching assets with query:', query);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return [];
    }

    const response = await client.getAssets(query);
    console.log(`[Contentful] Fetched ${response.items.length} assets`);
    
    return response.items;
  } catch (error) {
    console.error('[Contentful] Error fetching assets:', error);
    return [];
  }
}
