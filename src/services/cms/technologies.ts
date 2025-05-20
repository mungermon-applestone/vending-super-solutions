
// This file has been updated as part of the migration to Contentful
import { throwDeprecatedOperationError, showDeprecationToast } from './utils/deprecationToastUtils';

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

/**
 * @deprecated Use Contentful hooks instead
 */
export const getTechnologies = async () => {
  showDeprecationToast(
    "Deprecated API Call", 
    "getTechnologies is deprecated. Use useContentfulTechnologies hook instead."
  );
  return [];
};

/**
 * @deprecated Use Contentful hooks instead
 */
export const getTechnologyBySlug = async (slug: string) => {
  showDeprecationToast(
    "Deprecated API Call", 
    "getTechnologyBySlug is deprecated. Use useContentfulTechnology hook instead."
  );
  return null;
};

/**
 * @deprecated Use Contentful hooks instead
 */
export const deleteTechnology = async (id: string) => {
  throwDeprecatedOperationError("deleteTechnology");
  return { success: false, message: "Operation not supported" };
};

export default fetchTechnologies;
