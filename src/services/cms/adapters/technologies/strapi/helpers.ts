
import { STRAPI_API_URL, STRAPI_API_KEY, STRAPI_ENDPOINTS } from '@/config/strapiCms';
import { QueryOptions } from '@/types/cms';

/**
 * Build a URL for the Strapi API for technologies
 * @param endpoint Optional endpoint part or query string
 * @returns Full URL to the Strapi API
 */
export function buildTechnologyEndpoint(endpoint?: string): string {
  const base = `${STRAPI_API_URL}${STRAPI_ENDPOINTS.TECHNOLOGIES}`;
  return endpoint ? (endpoint.startsWith('?') ? `${base}${endpoint}` : `${base}/${endpoint}`) : base;
}

/**
 * Build Strapi filters from query options
 * @param options Query options
 * @returns URLSearchParams object with Strapi filters
 */
export function buildStrapiFilters(options?: QueryOptions | Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();
  
  if (!options) return params;
  
  // Process filters
  if (options.filters) {
    params.append('filters', JSON.stringify(options.filters));
  }
  
  // Process pagination
  if (options.limit) {
    params.append('pagination[limit]', options.limit.toString());
  }
  
  if (options.offset) {
    const page = Math.floor(options.offset / (options.limit || 25)) + 1;
    params.append('pagination[page]', page.toString());
  }
  
  // Process sorting
  if (options.orderBy) {
    const direction = options.orderDirection === 'desc' ? 'desc' : 'asc';
    params.append('sort', `${options.orderBy}:${direction}`);
  }
  
  // Add population for related data
  params.append('populate', '*');
  
  return params;
}

/**
 * Fetch data from Strapi
 * @param url URL to fetch from
 * @param method HTTP method
 * @param body Request body
 * @returns Parsed response data
 */
export async function fetchFromStrapi<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  console.log(`[fetchFromStrapi] ${method} ${url}`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if available
  if (STRAPI_API_KEY) {
    headers.Authorization = `Bearer ${STRAPI_API_KEY}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  // Add request body for POST and PUT requests
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    // For DELETE requests, we might get an empty response
    if (method === 'DELETE') {
      return true as unknown as T;
    }
    
    // Parse the response as JSON
    return await response.json();
  } catch (error) {
    console.error(`[fetchFromStrapi] Error fetching from Strapi:`, error);
    throw error;
  }
}
