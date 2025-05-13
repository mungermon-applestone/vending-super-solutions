
import { createClient, ContentfulClientApi, Entry, EntryCollection } from 'contentful';

// Cache the client instance to avoid recreating it
let contentfulClient: ContentfulClientApi | null = null;

/**
 * Get or create a Contentful client instance using environment variables
 */
export function getContentfulClient(): ContentfulClientApi | null {
  // If we've already created a client, return it
  if (contentfulClient) return contentfulClient;
  
  // Get configuration from environment variables
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
  
  // Log configuration status for debugging
  if (!spaceId || !accessToken) {
    console.warn('[contentfulClient] Missing Contentful configuration.');
    return null;
  }
  
  try {
    // Create and cache the client
    contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: environmentId
    });
    
    console.log('[contentfulClient] Contentful client created successfully');
    return contentfulClient;
  } catch (error) {
    console.error('[contentfulClient] Error creating Contentful client:', error);
    return null;
  }
}

/**
 * Alias for getContentfulClient for backward compatibility
 */
export const getContentfulClientInstance = getContentfulClient;

/**
 * Fetch multiple entries from Contentful
 * 
 * @param contentType Content type ID
 * @param query Optional query parameters
 * @returns Array of entries
 */
export async function fetchContentfulEntries<T>(contentType: string, query: Record<string, any> = {}): Promise<T[]> {
  const client = getContentfulClient();
  if (!client) {
    console.error('[contentfulClient] Contentful client is not available');
    return [];
  }
  
  try {
    const response: EntryCollection<any> = await client.getEntries({
      content_type: contentType,
      ...query
    });
    
    return response.items.map(item => {
      return {
        ...item.fields,
        id: item.sys.id
      } as unknown as T;
    });
  } catch (error) {
    console.error(`[contentfulClient] Error fetching entries of type ${contentType}:`, error);
    return [];
  }
}

/**
 * Fetch a single entry from Contentful by ID
 * 
 * @param entryId Entry ID
 * @returns Entry or null if not found
 */
export async function fetchContentfulEntry<T>(entryId: string): Promise<T | null> {
  const client = getContentfulClient();
  if (!client) {
    console.error('[contentfulClient] Contentful client is not available');
    return null;
  }
  
  try {
    const entry: Entry<any> = await client.getEntry(entryId);
    
    return {
      ...entry.fields,
      id: entry.sys.id
    } as unknown as T;
  } catch (error) {
    console.error(`[contentfulClient] Error fetching entry with ID ${entryId}:`, error);
    return null;
  }
}

/**
 * Check if Contentful is configured
 * 
 * @returns boolean indicating if Contentful is configured
 */
export function isContentfulConfigured(): boolean {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  return Boolean(spaceId && accessToken);
}
