
/**
 * Slug matching functionality - main entry point
 * Centralized module for all slug handling
 */

// Re-export common utilities
export { 
  normalizeSlug, 
  getCanonicalSlug, 
  getBasicVariations, 
  BUSINESS_GOAL_SLUG_MAP,
  CANONICAL_SLUG_MAP,
  COMMON_PREFIXES,
  logSlugOperation
} from './slug/common';

// Export main slug variation functionality
export { 
  getSlugVariations,
  slugsMatch, 
  findBestSlugMatch 
} from './slug/variations';

// Export mapping utilities
export { 
  mapUrlSlugToDatabaseSlug, 
  mapDatabaseSlugToUrlSlug, 
  registerSlugChange 
} from './slug/mapping';

// Export UUID utilities
export { 
  extractUUID, 
  createSlugWithUUID, 
  parseSlugWithUUID 
} from './slug/uuid';

// Export logging utilities
export { 
  logSlugSearch, 
  logSlugResult, 
  getSlugNotFoundMessage 
} from './slug/logging';

// Export normalize utilities
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
  // Import normalizeSlug from the common module to use it
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
