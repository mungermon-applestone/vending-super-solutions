
/**
 * This file provides utility functions for working with Contentful
 */

import { getContentfulClient } from './client';
import { waitForEnvironmentVariables, isContentfulConfigured } from './environment';
import { testContentfulConnection, validateContentfulClient } from './connection';
import { refreshContentfulClient } from './client';

/**
 * Helper function to fetch entries from Contentful
 */
export async function fetchContentfulEntries(contentType: string, query?: any) {
  const client = await getContentfulClient();
  return client.getEntries({
    content_type: contentType,
    ...query
  });
}

/**
 * Helper function to fetch a single entry from Contentful
 */
export async function fetchContentfulEntry(id: string) {
  const client = await getContentfulClient();
  return client.getEntry(id);
}

// Export all necessary functions for external use
export {
  waitForEnvironmentVariables,
  getContentfulClient,
  refreshContentfulClient,
  testContentfulConnection,
  isContentfulConfigured,
  validateContentfulClient
};
