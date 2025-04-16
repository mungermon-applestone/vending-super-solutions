
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
    
    // If we're in preview mode and don't have config, return null gracefully to enable fallbacks
    const isPreviewEnvironment = window.location.hostname.includes('lovable') || 
                                window.location.hostname.includes('preview');
    
    if (!config || !config.space_id) {
      console.error('[getContentfulClient] Missing Space ID');
      
      if (isPreviewEnvironment) {
        console.log('[getContentfulClient] Preview environment detected, allowing fallback content');
        return null;
      }
      
      return null;
    }
    
    // Require at least the delivery token
    if (!config.delivery_token) {
      console.error('[getContentfulClient] Missing Delivery Token (CDA)');
      
      if (isPreviewEnvironment) {
        console.log('[getContentfulClient] Preview environment detected, allowing fallback content');
        return null;
      }
      
      return null;
    }
    
    contentfulClient = createClient({
      space: config.space_id,
      accessToken: config.delivery_token,
      environment: config.environment_id || 'master',
    });
    
    console.log('[getContentfulClient] Successfully created Contentful client');
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Comprehensive error creating Contentful client:', error);
    
    // Check if we're in preview environment
    if (window.location.hostname.includes('lovable') || 
        window.location.hostname.includes('preview')) {
      console.log('[getContentfulClient] Preview environment detected, allowing fallback content');
      return null;
    }
    
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
    console.log(`[fetchContentfulEntries] Fetching entries for content type: ${contentType}`);
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[fetchContentfulEntries] Failed to get Contentful client');
      
      // In preview environments, we want to return an empty array instead of throwing
      if (window.location.hostname.includes('lovable') || 
          window.location.hostname.includes('preview')) {
        console.log('[fetchContentfulEntries] Preview environment, returning empty array');
        return [] as T[];
      }
      
      return [] as T[];
    }
    
    const query = {
      content_type: contentType,
      ...options
    };
    
    const response = await client.getEntries(query);
    console.log(`[fetchContentfulEntries] Fetched ${response.items.length} entries`);
    
    return response.items as T[];
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType}:`, error);
    
    // In preview environments, we want to return an empty array instead of throwing
    if (window.location.hostname.includes('lovable') || 
        window.location.hostname.includes('preview')) {
      return [] as T[];
    }
    
    return [] as T[];
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
