
/**
 * Slug normalization utilities
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
