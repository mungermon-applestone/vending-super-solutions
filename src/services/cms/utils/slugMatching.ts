
/**
 * Utility functions for slug matching and normalization
 */

/**
 * Normalize a slug by converting to lowercase, trimming and handling special cases
 * @param slug The slug to normalize
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Convert to lowercase and trim whitespace
  const normalized = slug.toLowerCase().trim();
  
  // Handle URL-encoded characters if any
  try {
    return decodeURIComponent(normalized);
  } catch (e) {
    // If decoding fails (e.g., not encoded), return the original normalized string
    return normalized;
  }
}

/**
 * Compare two slugs for exact match (case-insensitive)
 * @param slug1 First slug to compare
 * @param slug2 Second slug to compare
 * @returns Boolean indicating if slugs match
 */
export function exactSlugMatch(slug1: string, slug2: string): boolean {
  const normalizedSlug1 = normalizeSlug(slug1);
  const normalizedSlug2 = normalizeSlug(slug2);
  return normalizedSlug1 === normalizedSlug2;
}

/**
 * Log details about slug search for debugging
 * @param slug The slug being searched
 * @param searchType The type of search being performed
 */
export function logSlugSearch(slug: string, searchType: string): void {
  console.log(`[fetchFromCMS] ${searchType} for slug: "${slug}"`);
}

/**
 * Log the result of a slug search
 * @param slug The slug that was searched
 * @param result The result of the search
 * @param matchType The type of match found
 */
export function logSlugResult(slug: string, result: any, matchType: string): void {
  if (result && result.length > 0) {
    console.log(`[fetchFromCMS] ${matchType} match found for "${slug}": "${result[0].title || 'untitled'}"`);
  } else {
    console.log(`[fetchFromCMS] No ${matchType} match found for "${slug}"`);
  }
}
