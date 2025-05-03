
/**
 * Utilities for normalizing slugs
 */

/**
 * Normalize a slug to a consistent format
 * @param slug The slug to normalize
 * @returns A normalized version of the slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Convert to lowercase
  let normalizedSlug = slug.toLowerCase();
  
  // Remove trailing slashes
  normalizedSlug = normalizedSlug.replace(/\/$/, '');
  
  // Remove any URL parameters
  normalizedSlug = normalizedSlug.split('?')[0];
  
  // Remove special characters except hyphens and underscores
  normalizedSlug = normalizedSlug.replace(/[^a-z0-9_-]/g, '');
  
  return normalizedSlug;
}

/**
 * Check if two slugs are an exact match (case-sensitive)
 * @param slugA First slug
 * @param slugB Second slug
 * @returns Whether the slugs are an exact match
 */
export function exactSlugMatch(slugA: string, slugB: string): boolean {
  return slugA === slugB;
}
