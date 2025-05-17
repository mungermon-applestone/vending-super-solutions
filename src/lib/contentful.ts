
import { createClient } from 'contentful';

// Create a Contentful client using environment variables
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || 'default-space-id',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'default-access-token',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Helper function to check if Contentful is properly configured
export function isContentfulConfigured(): boolean {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID && 
    process.env.CONTENTFUL_ACCESS_TOKEN
  );
}

// Utility function to build query options for Contentful
export function buildContentfulQueryParams(options: any = {}): Record<string, any> {
  const queryParams: Record<string, any> = {};
  
  // Handle pagination
  if (options.limit) {
    queryParams.limit = options.limit;
  }
  
  if (options.skip || options.offset) {
    queryParams.skip = options.skip || options.offset || 0;
  }
  
  // Handle ordering
  if (options.orderBy) {
    const direction = options.orderDirection === 'desc' ? '-' : '';
    queryParams.order = `${direction}fields.${options.orderBy}`;
  }
  
  // Handle filtering (simplified approach, more complex filtering would need adaptation)
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      queryParams[`fields.${key}`] = value;
    });
  }
  
  return queryParams;
}
