import { getStrapiBaseUrl, getStrapiApiKey } from '../../../utils/strapiConfig';

/**
 * Build the endpoint URL for business goals
 * @param path Optional path to append to the base endpoint
 * @returns The full URL for the business goals endpoint
 */
export function buildBusinessGoalEndpoint(path?: string): string {
  const baseUrl = getStrapiBaseUrl();
  if (!baseUrl) {
    throw new Error('Strapi API URL not configured');
  }
  
  const endpoint = `${baseUrl}/business-goals`;
  
  if (path) {
    // If path starts with ? or /, just append it
    if (path.startsWith('?') || path.startsWith('/')) {
      return `${endpoint}${path}`;
    }
    // Otherwise, add / before the path
    return `${endpoint}/${path}`;
  }
  
  return endpoint;
}

/**
 * Build query parameters for filtering and population
 */
export function buildStrapiFilters(filters?: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();
  
  // Add default population
  params.append('populate', 'image,features,features.screenshot,benefits');
  
  // Add filters if provided
  if (filters && Object.keys(filters).length > 0) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        params.append(`filters[${key}]`, String(value));
      }
    }
  }
  
  return params;
}

/**
 * Fetch data from Strapi API with authorization if available
 */
export async function fetchFromStrapi<T>(url: string, method: string = 'GET', body?: any): Promise<T> {
  const apiKey = getStrapiApiKey();
  
  // Build request options
  const options: RequestInit = {
    method,
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify({ data: body }) } : {})
  };
  
  // Make the request
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}
