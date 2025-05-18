
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';
import { getCMSProviderConfig } from '../../providerConfig';
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { handleCMSError } from '../../utils/errorHandling';

/**
 * Fetch technologies from the CMS
 * @param options Query options for filtering and pagination
 * @returns Array of technology objects
 */
export async function fetchTechnologies(options?: QueryOptions): Promise<CMSTechnology[]> {
  try {
    const adapter = getTechnologyAdapter();
    
    return await adapter.getAll(options);
  } catch (error) {
    throw handleCMSError(error, 'fetch', 'technologies');
  }
}

/**
 * Fetch technologies with error handling for safe integration between CMS providers
 * @param options Query options for filtering and pagination
 * @returns Array of technology objects or empty array on error
 */
export async function fetchTechnologiesSafe(options?: QueryOptions): Promise<CMSTechnology[]> {
  try {
    return await fetchTechnologies(options);
  } catch (error) {
    console.error('[fetchTechnologiesSafe] Error fetching technologies:', error);
    return [];
  }
}

export default fetchTechnologies;
