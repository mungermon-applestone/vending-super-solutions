
// This file re-exports from our central Contentful client implementation 
// to maintain backward compatibility

import { 
  getContentfulClient, 
  refreshContentfulClient, 
  testContentfulConnection,
  isContentfulConfigured,
  validateContentfulClient
} from '@/services/contentful/client';

// Re-export all functions from the main Contentful client
export {
  getContentfulClient,
  refreshContentfulClient,
  testContentfulConnection,
  isContentfulConfigured,
  validateContentfulClient
};
