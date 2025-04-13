
import { STRAPI_CONFIG } from '@/config/cms';
import { buildStrapiUrl, createStrapiHeaders } from '../../../utils/strapiConfig';

/**
 * Builds the Strapi API URL for technology endpoints
 * @param endpoint Specific endpoint or path after the base technology URL
 * @returns Full Strapi API URL
 */
export function buildTechnologyEndpoint(endpoint?: string): string {
  const basePath = STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES;
  if (!endpoint) {
    return buildStrapiUrl(basePath);
  }
  
  // Ensure we don't have double slashes
  if (endpoint.startsWith('/')) {
    return buildStrapiUrl(`${basePath}${endpoint}`);
  }
  
  return buildStrapiUrl(`${basePath}/${endpoint}`);
}

/**
 * Converts filter parameters to Strapi query format
 * @param filters Object containing filter parameters
 * @returns URLSearchParams object with formatted Strapi filters
 */
export function buildStrapiFilters(filters?: Record<string, any>): URLSearchParams {
  const queryParams = new URLSearchParams();
  
  if (!filters || Object.keys(filters).length === 0) {
    return queryParams;
  }
  
  // Handle common filters
  if (filters.visible !== undefined) {
    queryParams.append('filters[visible][$eq]', filters.visible.toString());
  }
  
  if (filters.search) {
    queryParams.append('filters[$or][0][title][$containsi]', filters.search);
    queryParams.append('filters[$or][1][description][$containsi]', filters.search);
  }
  
  return queryParams;
}

/**
 * Fetches data from Strapi API
 * @param url API endpoint URL
 * @param method HTTP method
 * @param body Optional request body
 * @returns Response data
 */
export async function fetchFromStrapi<T>(
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: createStrapiHeaders()
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }
  
  if (method === 'DELETE') {
    return true as unknown as T;
  }
  
  return await response.json();
}
