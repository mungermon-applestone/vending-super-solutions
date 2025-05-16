
// This file re-exports from our central Contentful client implementation
// to maintain backward compatibility

import { 
  getContentfulClient, 
  contentfulClient as realContentfulClient,
  isContentfulConfigured as realIsContentfulConfigured,
  testContentfulConnection as realTestContentfulConnection,
  fetchContentfulEntries,
  fetchContentfulEntry
} from '@/services/contentful/client';

// Re-export the lazy-loaded client to ensure consistency
export const contentfulClient = realContentfulClient;

// Re-export the configuration check
export const isContentfulConfigured = realIsContentfulConfigured;

// Re-export the async test function for backward compatibility
export function testContentfulConnection() {
  return realTestContentfulConnection();
}

// Re-export helper functions
export { fetchContentfulEntries, fetchContentfulEntry };
