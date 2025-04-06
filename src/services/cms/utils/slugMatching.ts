
/**
 * Utility functions for slug matching and normalization
 */

/**
 * Normalize a slug by converting to lowercase and trimming
 * @param slug The slug to normalize
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  return slug.toLowerCase().trim();
}

/**
 * Log details about slug search for debugging
 * @param slug The slug being searched
 * @param searchType The type of search being performed
 */
export function logSlugSearch(slug: string, searchType: string): void {
  console.log(`[fetchFromCMS] ${searchType} for slug: "${slug}"`);
}
