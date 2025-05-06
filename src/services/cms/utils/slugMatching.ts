
/**
 * Slug matching functionality - main entry point
 * Centralized module for all slug handling
 */

// Import necessary functions from modules
import { normalizeSlug, getCanonicalSlug, getBasicVariations, BUSINESS_GOAL_SLUG_MAP, CANONICAL_SLUG_MAP, COMMON_PREFIXES, logSlugOperation } from './slug/common';

// Import slug variation functionality
import { getSlugVariations, slugsMatch, findBestSlugMatch } from './slug/variations';

// Import mapping utilities
import { mapUrlSlugToDatabaseSlug, mapDatabaseSlugToUrlSlug, registerSlugChange } from './slug/mapping';

// Import UUID utilities
import { extractUUID, createSlugWithUUID, parseSlugWithUUID } from './slug/uuid';

// Import logging utilities
import { logSlugSearch, logSlugResult, getSlugNotFoundMessage } from './slug/logging';

// Import normalize utilities
import { exactSlugMatch } from './slug/normalize';

// Re-export all the imported functions for use by external modules
export { 
  normalizeSlug, 
  getCanonicalSlug, 
  getBasicVariations, 
  BUSINESS_GOAL_SLUG_MAP,
  CANONICAL_SLUG_MAP,
  COMMON_PREFIXES,
  logSlugOperation
} from './slug/common';

export { 
  getSlugVariations,
  slugsMatch, 
  findBestSlugMatch 
} from './slug/variations';

export { 
  mapUrlSlugToDatabaseSlug, 
  mapDatabaseSlugToUrlSlug, 
  registerSlugChange 
} from './slug/mapping';

export { 
  extractUUID, 
  createSlugWithUUID, 
  parseSlugWithUUID 
} from './slug/uuid';

export { 
  logSlugSearch, 
  logSlugResult, 
  getSlugNotFoundMessage 
} from './slug/logging';

export { 
  exactSlugMatch 
} from './slug/normalize';

/**
 * Comprehensive function to resolve a slug to its best match
 * @param inputSlug Original slug from URL or user input
 * @param availableSlugs Array of available slugs in the database (optional)
 * @returns The best matching slug or the canonical version if no match
 */
export function resolveSlug(inputSlug: string, availableSlugs?: string[]): string {
  if (!inputSlug) return '';
  
  console.log(`[resolveSlug] Processing input slug: "${inputSlug}"`);
  
  // Step 1: Normalize the input slug
  const normalizedSlug = normalizeSlug(inputSlug);
  console.log(`[resolveSlug] Normalized slug: "${normalizedSlug}"`);
  
  // Step 2: Get the canonical form if it exists
  const canonicalSlug = getCanonicalSlug(normalizedSlug);
  console.log(`[resolveSlug] Canonical slug: "${canonicalSlug}"`);
  
  // Step 3: If we have available slugs, try to find a direct match
  if (availableSlugs?.length) {
    // Try with canonical slug first
    if (availableSlugs.includes(canonicalSlug)) {
      console.log(`[resolveSlug] Found direct match with canonical slug: "${canonicalSlug}"`);
      return canonicalSlug;
    }
    
    // Then try with normalized slug
    if (availableSlugs.includes(normalizedSlug)) {
      console.log(`[resolveSlug] Found direct match with normalized slug: "${normalizedSlug}"`);
      return normalizedSlug;
    }
    
    // Try the original slug
    if (availableSlugs.includes(inputSlug)) {
      console.log(`[resolveSlug] Found direct match with original slug: "${inputSlug}"`);
      return inputSlug;
    }
    
    // If no direct match, try finding a best match
    const bestMatch = findBestSlugMatch(canonicalSlug || normalizedSlug, availableSlugs);
    if (bestMatch) {
      console.log(`[resolveSlug] Found best match: "${bestMatch}" for input: "${inputSlug}"`);
      return bestMatch;
    }
  }
  
  // Step 4: Default to the canonical form, or normalized form if no canonical exists
  const resultSlug = canonicalSlug || normalizedSlug;
  console.log(`[resolveSlug] No match found, using ${canonicalSlug ? 'canonical' : 'normalized'} slug: "${resultSlug}"`);
  return resultSlug;
}
