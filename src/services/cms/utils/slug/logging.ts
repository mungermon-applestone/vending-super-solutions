
/**
 * Logging utilities for slug operations
 */

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
