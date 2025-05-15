
import { createClient, EntryCollection, Entry, ContentfulClientApi } from 'contentful';
import { toast } from 'sonner';

// Store the client instance for reuse
let contentfulClientInstance: ContentfulClientApi | null = null;

/**
 * Get a Contentful client instance, creating a new one if needed
 */
export async function getContentfulClient(): Promise<ContentfulClientApi> {
  if (contentfulClientInstance) {
    return contentfulClientInstance;
  }

  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

  if (!spaceId || !accessToken) {
    console.error('[getContentfulClient] Missing Contentful credentials');
    throw new Error('Contentful credentials are missing');
  }

  try {
    contentfulClientInstance = createClient({
      space: spaceId,
      accessToken,
      environment,
    });

    return contentfulClientInstance;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    throw new Error('Failed to initialize Contentful client');
  }
}

/**
 * Refresh the Contentful client instance (for example, after credentials change)
 */
export async function refreshContentfulClient(): Promise<ContentfulClientApi> {
  // Clear existing instance
  contentfulClientInstance = null;
  
  try {
    const newClient = await getContentfulClient();
    toast.success('Contentful client refreshed');
    return newClient;
  } catch (error) {
    toast.error('Failed to refresh Contentful client');
    throw error;
  }
}

/**
 * Test the Contentful connection
 */
export async function testContentfulConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    const client = await getContentfulClient();
    
    // Make a simple request to verify the client works
    const response = await client.getEntries({
      limit: 1,
    });
    
    return {
      success: true,
      message: 'Connection to Contentful successful',
      details: {
        total: response.total,
        limit: response.limit,
        skip: response.skip
      }
    };
  } catch (error) {
    console.error('[testContentfulConnection] Connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      details: { error }
    };
  }
}

/**
 * Fetch multiple entries from Contentful
 */
export async function fetchContentfulEntries<T>(
  contentType: string, 
  options: Record<string, any> = {}
): Promise<EntryCollection<T>> {
  try {
    const client = await getContentfulClient();
    
    return await client.getEntries<T>({
      content_type: contentType,
      ...options
    });
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType} entries:`, error);
    throw error;
  }
}

/**
 * Fetch a single entry from Contentful
 */
export async function fetchContentfulEntry<T>(
  contentType: string,
  id: string
): Promise<Entry<T> | null> {
  try {
    const client = await getContentfulClient();
    
    return await client.getEntry<T>(id);
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching ${contentType} entry ${id}:`, error);
    return null;
  }
}
