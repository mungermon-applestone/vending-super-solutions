
import { createClient, ContentfulClientApi } from 'contentful';
import { toast } from 'sonner';
import { 
  getContentfulClient, 
  refreshContentfulClient, 
  testContentfulConnection,
  fetchContentfulEntries, 
  fetchContentfulEntry,
  isContentfulConfigured,
  validateContentfulClient
} from '@/services/contentful/client';

// Re-export all functions from the main Contentful client
export {
  getContentfulClient,
  refreshContentfulClient,
  testContentfulConnection,
  fetchContentfulEntries,
  fetchContentfulEntry,
  isContentfulConfigured,
  validateContentfulClient
};

/**
 * Get a Contentful client instance, creating a new one if needed
 * This is maintained for backward compatibility
 */
export async function getClient(): Promise<ContentfulClientApi> {
  return getContentfulClient();
}

/**
 * Validate that the Contentful client is working correctly
 * This is maintained for backward compatibility
 */
export async function validateClient(): Promise<boolean> {
  return validateContentfulClient();
}
