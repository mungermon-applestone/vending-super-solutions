
/**
 * Utility to handle deprecation notices for legacy CMS functionality
 */

// Log deprecation warnings
export function logDeprecation(oldApi: string, newApi: string): void {
  console.warn(`[DEPRECATED] ${oldApi} is deprecated. Please use ${newApi} instead.`);
}

// Get Contentful redirect URL
export function getContentfulRedirectUrl(path: string = ''): string {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  
  const baseUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}`;
  
  return path ? `${baseUrl}/${path}` : baseUrl;
}
