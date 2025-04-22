
// This file is a re-export of the modularized technologies files
import { technologyOperations } from './technologies/index';
import {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
} from './technologies/index';

// Also export with alternate names for backward compatibility
const getTechnologyBySlug = fetchTechnologyBySlug;
const getTechnologies = fetchTechnologies;

/**
 * Wrapper around fetchTechnologyBySlug that catches and handles errors
 * to ensure compatibility between CMS providers
 */
export const fetchTechnologyBySlugSafe = async (slug: string) => {
  try {
    console.log(`[fetchTechnologyBySlugSafe] Fetching technology with slug: ${slug}`);
    const technology = await fetchTechnologyBySlug(slug);
    return technology;
  } catch (error) {
    console.error(`[fetchTechnologyBySlugSafe] Error fetching technology with slug ${slug}:`, error);
    return null;
  }
};

export {
  technologyOperations,
  fetchTechnologyBySlug,
  getTechnologyBySlug,
  fetchTechnologies,
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
