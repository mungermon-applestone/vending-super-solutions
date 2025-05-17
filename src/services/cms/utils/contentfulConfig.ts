
/**
 * Utilities for Contentful configuration
 */

/**
 * Get the space ID for the Contentful API from environment variables
 */
export function getContentfulSpaceId(): string | undefined {
  return process.env.CONTENTFUL_SPACE_ID;
}

/**
 * Get the access token for authenticating with Contentful from environment variables
 */
export function getContentfulAccessToken(): string | undefined {
  return process.env.CONTENTFUL_ACCESS_TOKEN;
}

/**
 * Get the environment ID for Contentful from environment variables
 */
export function getContentfulEnvironment(): string {
  return process.env.CONTENTFUL_ENVIRONMENT || 'master';
}

/**
 * Build headers for Contentful API requests including authorization
 */
export function getContentfulHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getContentfulAccessToken()}`
  };
}

/**
 * Check if Contentful is properly configured
 */
export function isContentfulConfigured(): boolean {
  return Boolean(getContentfulSpaceId() && getContentfulAccessToken());
}

/**
 * Validate Contentful configuration and throw an error if not properly configured
 */
export function validateContentfulConfig(): void {
  if (!getContentfulSpaceId()) {
    throw new Error('Contentful Space ID is not configured. Please set CONTENTFUL_SPACE_ID environment variable.');
  }
  
  if (!getContentfulAccessToken()) {
    throw new Error('Contentful Access Token is not configured. Please set CONTENTFUL_ACCESS_TOKEN environment variable.');
  }
}

/**
 * Helper to build Contentful query parameters for API requests
 */
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
  
  // Handle content type
  if (options.contentType) {
    queryParams.content_type = options.contentType;
  }
  
  // Handle include depth
  queryParams.include = options.include || 2;
  
  // Handle filtering (simplified approach, more complex filtering would need adaptation)
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      queryParams[`fields.${key}`] = value;
    });
  }
  
  return queryParams;
}
