
import { createClient, ContentfulClientApi, Entry, EntryCollection } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';

// Cache the client instance to avoid recreating it
let contentfulClient: ContentfulClientApi | null = null;

/**
 * Get or create a Contentful client instance using environment variables
 */
export function getContentfulClient(): ContentfulClientApi | null {
  // If we've already created a client, return it
  if (contentfulClient) return contentfulClient;
  
  try {
    // Get configuration from environment variables
    const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
    const accessToken = CONTENTFUL_CONFIG.DELIVERY_TOKEN;
    const environmentId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
    
    // Log configuration status for debugging
    if (!spaceId || !accessToken) {
      console.warn('[contentfulClient] Missing Contentful configuration.', {
        spaceId: spaceId ? 'Set' : 'Missing',
        accessToken: accessToken ? 'Set' : 'Missing',
        environmentId
      });
      return null;
    }
    
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
 * Refresh the Contentful client (create a new instance)
 */
export async function refreshContentfulClient(): Promise<ContentfulClientApi | null> {
  try {
    console.log('[contentfulClient] Refreshing client with current config');
    
    // Clear the cached client
    contentfulClient = null;
    
    // If we're in a browser environment, try to reload configuration from runtime
    if (typeof window !== 'undefined' && window._refreshContentfulAfterConfig) {
      try {
        await window._refreshContentfulAfterConfig();
      } catch (refreshError) {
        console.warn('[contentfulClient] Error refreshing runtime config:', refreshError);
      }
    }
    
    // Return a fresh client
    return getContentfulClient();
  } catch (error) {
    console.error('[contentfulClient] Error refreshing client:', error);
    return null;
  }
}

/**
 * Reset the Contentful client (clear the cached instance)
 */
export function resetContentfulClient(): void {
  contentfulClient = null;
  console.log('[contentfulClient] Client instance reset');
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
export async function fetchContentfulEntries(contentType: string, query: Record<string, any> = {}): Promise<any[]> {
  const client = getContentfulClient();
  if (!client) {
    console.error('[contentfulClient] Contentful client is not available');
    return [];
  }
  
  try {
    console.log(`[contentfulClient] Fetching entries of type ${contentType} with query:`, query);
    
    const response: EntryCollection<any> = await client.getEntries({
      content_type: contentType,
      include: 2,  // Include 2 levels of linked entries
      ...query
    });
    
    console.log(`[contentfulClient] Fetched ${response.items.length} entries of type ${contentType}`);
    return response.items;
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
export async function fetchContentfulEntry(entryId: string): Promise<any | null> {
  const client = getContentfulClient();
  if (!client) {
    console.error('[contentfulClient] Contentful client is not available');
    return null;
  }
  
  try {
    console.log(`[contentfulClient] Fetching entry with ID ${entryId}`);
    const entry: Entry<any> = await client.getEntry(entryId, { include: 2 });
    return entry;
  } catch (error) {
    console.error(`[contentfulClient] Error fetching entry with ID ${entryId}:`, error);
    return null;
  }
}

/**
 * Export the test connection function
 */
export { testContentfulConnection } from './testContentfulConnection';

/**
 * Check if Contentful is configured
 */
export function isContentfulConfigured(): boolean {
  const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
  const accessToken = CONTENTFUL_CONFIG.DELIVERY_TOKEN;
  return Boolean(spaceId && accessToken);
}
