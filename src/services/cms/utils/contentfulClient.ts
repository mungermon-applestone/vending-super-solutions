
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';

let contentfulClient: any = null;

/**
 * Initialize or retrieve the Contentful client
 */
export function getContentfulClient() {
  if (!isContentfulConfigured()) {
    throw new Error('Contentful is not configured');
  }
  
  if (!contentfulClient) {
    contentfulClient = createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    });
  }
  
  return contentfulClient;
}

/**
 * Refresh the Contentful client
 */
export function refreshContentfulClient() {
  if (!isContentfulConfigured()) {
    throw new Error('Contentful is not configured');
  }
  
  contentfulClient = createClient({
    space: CONTENTFUL_CONFIG.SPACE_ID,
    accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
  });
  
  return contentfulClient;
}

/**
 * Test the Contentful connection
 */
export async function testContentfulConnection() {
  const client = getContentfulClient();
  
  try {
    // Try to fetch a single entry to verify connectivity
    const response = await client.getEntries({ limit: 1 });
    return {
      success: true,
      message: `Connection successful. Total entries: ${response.total}`
    };
  } catch (error) {
    console.error('[testContentfulConnection] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
}

/**
 * Fetch entries from Contentful by content type
 * @param contentType The content type to fetch
 * @param queryParams Additional query parameters
 */
export async function fetchContentfulEntries(contentType: string, queryParams: Record<string, any> = {}) {
  const client = getContentfulClient();
  
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      include: 2,
      ...queryParams
    });
    
    return entries.items;
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType}:`, error);
    throw error;
  }
}

/**
 * Fetch a single entry from Contentful by ID
 * @param entryId The ID of the entry to fetch
 */
export async function fetchContentfulEntry(entryId: string) {
  const client = getContentfulClient();
  
  try {
    return await client.getEntry(entryId, { include: 2 });
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ${entryId}:`, error);
    throw error;
  }
}
