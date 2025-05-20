
import { CMSTechnology } from '@/types/cms';
import { showDeprecationToast } from '../../utils/deprecationToastUtils';

/**
 * Fetch all technologies from Contentful
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful hooks directly for technology content management.
 */
export async function fetchTechnologies(): Promise<CMSTechnology[]> {
  console.warn('[fetchTechnologies] This function is deprecated. Use useContentfulTechnologies hook instead.');
  showDeprecationToast(
    "Deprecated API Call", 
    "fetchTechnologies is deprecated. Use useContentfulTechnologies hook instead."
  );
  return [];
}

/**
 * Safe version of fetchTechnologies that doesn't throw errors
 * @deprecated This method is deprecated and will be removed in future versions.
 */
export async function fetchTechnologiesSafe(): Promise<CMSTechnology[]> {
  try {
    return await fetchTechnologies();
  } catch (error) {
    console.error('[fetchTechnologiesSafe] Error:', error);
    return [];
  }
}
