
import { getCMSProviderConfig } from '../../../providerConfig';
import { buildStrapiUrl, createStrapiHeaders } from '../../../utils/strapiConfig';
import { STRAPI_CONFIG } from '@/config/cms';

/**
 * Builds the Strapi API URL for business goal endpoints
 * @param endpoint Specific endpoint or path after the base business goal URL
 * @returns Full Strapi API URL
 */
export function buildBusinessGoalEndpoint(endpoint?: string): string {
  const basePath = STRAPI_CONFIG.ENDPOINTS.BUSINESS_GOALS;
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
  
  // Add populate parameter to include related data
  queryParams.append('populate', 'benefits');
  queryParams.append('populate', 'features');
  queryParams.append('populate', 'features.screenshot');
  queryParams.append('populate', 'image');
  
  if (!filters || Object.keys(filters).length === 0) {
    return queryParams;
  }
  
  // Handle visibility filter
  if (filters.visible !== undefined) {
    queryParams.append('filters[visible][$eq]', filters.visible.toString());
  }
  
  // Handle search filter
  if (filters.search) {
    queryParams.append('filters[$or][0][title][$containsi]', filters.search);
    queryParams.append('filters[$or][1][description][$containsi]', filters.search);
    queryParams.append('filters[$or][2][slug][$containsi]', filters.search);
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
  const config = getCMSProviderConfig();
  if (!config.apiUrl) {
    throw new Error('Strapi API URL not configured');
  }
  
  const options: RequestInit = {
    method,
    headers: createStrapiHeaders()
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify({ data: body });
  }
  
  console.log(`[fetchFromStrapi] ${method} ${url}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchFromStrapi] Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }
  
  if (method === 'DELETE') {
    return true as unknown as T;
  }
  
  return await response.json();
}
