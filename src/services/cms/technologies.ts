
// This file has been updated as part of the migration to Contentful
import { ContentfulTechnology } from '@/types/contentful';

/**
 * @deprecated This module is deprecated and will be removed in future versions.
 * Use Contentful hooks directly instead.
 */

/**
 * Fetch all technologies from Contentful
 */
export const fetchTechnologies = async () => {
  console.warn('[fetchTechnologies] This function is deprecated. Use useContentfulTechnologies hook instead.');
  return [];
};

export default fetchTechnologies;
