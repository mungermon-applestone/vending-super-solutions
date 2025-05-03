
/**
 * Utilities for logging slug search and results
 */

/**
 * Log the beginning of a slug search
 * @param contentType The type of content being searched for
 * @param searchSlug The slug being searched for
 */
export function logSlugSearch(contentType: string, searchSlug: string): void {
  console.log(`[SlugMatching] Searching for ${contentType} with slug: "${searchSlug}"`);
}

/**
 * Log the result of a slug search
 * @param contentType The type of content being searched for
 * @param urlSlug The slug from the URL
 * @param dbSlug The slug used in the database query
 * @param found Whether a match was found
 */
export function logSlugResult(contentType: string, urlSlug: string, dbSlug: string, found: boolean): void {
  if (found) {
    console.log(`[SlugMatching] ✓ Found ${contentType} with URL slug "${urlSlug}" -> DB slug "${dbSlug}"`);
  } else {
    console.log(`[SlugMatching] ✗ No ${contentType} found with URL slug "${urlSlug}" -> DB slug "${dbSlug}"`);
  }
}

/**
 * Generate a standardized error message for slug not found
 * @param contentType The type of content that wasn't found
 * @param slug The slug that was searched for
 * @returns A standardized error message
 */
export function getSlugNotFoundMessage(contentType: string, slug: string): string {
  return `${contentType} not found: "${slug}"`;
}
