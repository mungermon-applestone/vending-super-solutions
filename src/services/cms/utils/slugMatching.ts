
/**
 * Utilities for handling slug matching and normalization
 */

/**
 * Normalize a slug by removing special characters and making it URL-friendly
 * @param slug The slug to normalize
 */
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
}

/**
 * Get the canonical form of a slug
 * @param slug The slug to canonicalize
 */
export function getCanonicalSlug(slug: string): string {
  return normalizeSlug(slug);
}

/**
 * Check if two slugs match (case-insensitive)
 * @param slug1 First slug
 * @param slug2 Second slug
 */
export function doSlugsMatch(slug1: string, slug2: string): boolean {
  return normalizeSlug(slug1) === normalizeSlug(slug2);
}

/**
 * Convert slug variations and find the right format
 * @param slug The slug to resolve
 * @returns The resolved slug
 */
export function resolveSlug(slug: string): string {
  // Handle common slug variations
  const variations = [
    slug,
    slug.replace(/-/g, '_'),
    slug.replace(/_/g, '-'),
    normalizeSlug(slug)
  ];
  
  // Return the first variation (original) as default
  return variations[0];
}

/**
 * Get all possible variations of a slug
 * @param slug The base slug
 * @returns An array of possible slug variations
 */
export function getSlugVariations(slug: string): string[] {
  return [
    slug,
    slug.replace(/-/g, '_'),
    slug.replace(/_/g, '-'),
    normalizeSlug(slug)
  ];
}
