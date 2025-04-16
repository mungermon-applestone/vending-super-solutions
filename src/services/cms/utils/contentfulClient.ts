
import { createClient } from 'contentful';
import { getContentfulConfig } from './cmsInfo';

// Cache the client to avoid creating a new one on every request
let contentfulClient: ReturnType<typeof createClient> | null = null;

/**
 * Gets or creates a Contentful delivery client for content fetching
 */
export const getContentfulClient = async () => {
  // Return cached client if available
  if (contentfulClient) {
    return contentfulClient;
  }
  
  try {
    console.log('[getContentfulClient] Creating new Contentful client');
    const config = await getContentfulConfig();
    
    // Add more detailed logging for configuration
    console.log('[getContentfulClient] Configuration received:', {
      hasConfig: !!config,
      hasSpaceId: config?.space_id ? 'Yes' : 'No',
      hasDeliveryToken: config?.delivery_token ? 'Yes' : 'No',
      hasManagementToken: config?.management_token ? 'Yes' : 'No',
      environmentId: config?.environment_id || 'master'
    });
    
    if (!config || !config.space_id || !config.delivery_token) {
      console.error('[getContentfulClient] Missing required Contentful credentials');
      if (!config) console.error('  - No configuration found');
      if (config && !config.space_id) console.error('  - Missing Space ID');
      if (config && !config.delivery_token) console.error('  - Missing Delivery Token');
      
      throw new Error('Missing Contentful configuration. Please set up your Contentful credentials in Admin Settings.');
    }
    
    contentfulClient = createClient({
      space: config.space_id,
      accessToken: config.delivery_token,
      environment: config.environment_id || 'master',
    });
    
    // Test the client with a simple request
    try {
      const space = await contentfulClient.getSpace();
      console.log(`[getContentfulClient] Successfully connected to Contentful space: ${space.name}`);
    } catch (e) {
      console.error('[getContentfulClient] Failed to verify Contentful connection:', e);
      contentfulClient = null;
      throw new Error(`Failed to connect to Contentful: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    
    console.log('[getContentfulClient] Successfully created Contentful client');
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    throw error;
  }
};

// Add a function to reset the client - useful when config changes
export const resetContentfulClient = () => {
  console.log('[contentfulClient] Resetting Contentful client');
  contentfulClient = null;
};

/**
 * Fetches entries from Contentful by content type
 */
export const fetchContentfulEntries = async <T>(contentType: string, options: any = {}): Promise<T[]> => {
  try {
    console.log(`[fetchContentfulEntries] Fetching entries for content type: ${contentType}`, options);
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[fetchContentfulEntries] Failed to get Contentful client');
      throw new Error('Failed to initialize Contentful client');
    }
    
    const query = {
      content_type: contentType,
      ...options
    };
    
    console.log(`[fetchContentfulEntries] Executing query:`, query);
    
    const response = await client.getEntries(query);
    console.log(`[fetchContentfulEntries] Fetched ${response.items.length} entries for ${contentType}`);
    
    if (contentType === 'productType') {
      // Special handling for product types to help debug
      console.log(`[fetchContentfulEntries] Product types content details:`, {
        count: response.items.length,
        items: response.items.map(item => ({
          id: item.sys?.id,
          slug: item.fields?.slug,
          title: item.fields?.title
        }))
      });
    }
    
    return response.items as T[];
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType}:`, error);
    throw error;
  }
};

/**
 * Fetches a single entry from Contentful by ID
 */
export const fetchContentfulEntry = async <T>(entryId: string): Promise<T | null> => {
  try {
    console.log(`[fetchContentfulEntry] Fetching entry with ID: ${entryId}`);
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[fetchContentfulEntry] Failed to get Contentful client');
      return null;
    }
    
    const entry = await client.getEntry(entryId);
    
    return {
      id: entry.sys.id,
      ...entry.fields
    } as T;
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ${entryId}:`, error);
    return null;
  }
};

/**
 * Fetches a single entry from Contentful by slug field value
 */
export const fetchContentfulEntryBySlug = async <T>(contentType: string, slug: string): Promise<T | null> => {
  try {
    console.log(`[fetchContentfulEntryBySlug] Fetching ${contentType} with slug: "${slug}"`);
    
    if (!slug) {
      console.warn(`[fetchContentfulEntryBySlug] No slug provided for ${contentType}`);
      return null;
    }
    
    const entries = await fetchContentfulEntries<T>(contentType, {
      'fields.slug': slug,
      limit: 1
    });
    
    if (entries.length === 0) {
      console.warn(`[fetchContentfulEntryBySlug] No ${contentType} found with slug: "${slug}"`);
      
      // Try with unencoded slug as a fallback
      if (slug.includes('%20') || slug.includes('%')) {
        const decodedSlug = decodeURIComponent(slug);
        console.log(`[fetchContentfulEntryBySlug] Trying with decoded slug: "${decodedSlug}"`);
        const entriesWithDecodedSlug = await fetchContentfulEntries<T>(contentType, {
          'fields.slug': decodedSlug,
          limit: 1
        });
        
        if (entriesWithDecodedSlug.length > 0) {
          console.log(`[fetchContentfulEntryBySlug] Found ${contentType} with decoded slug`);
          return entriesWithDecodedSlug[0];
        }
      }
      
      return null;
    }
    
    console.log(`[fetchContentfulEntryBySlug] Successfully retrieved ${contentType} with slug: "${slug}"`);
    return entries[0];
  } catch (error) {
    console.error(`[fetchContentfulEntryBySlug] Error fetching ${contentType} with slug "${slug}":`, error);
    return null;
  }
};
