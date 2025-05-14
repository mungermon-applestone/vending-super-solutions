
/**
 * Utility functions for slug management and matching
 */

/**
 * Prepare a slug by trimming, lowercasing, and replacing spaces with hyphens
 */
export function prepareSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Map a URL slug to the format used in the database
 * This handles common transformations needed for matching
 */
export function mapUrlSlugToDatabaseSlug(urlSlug: string): string {
  if (!urlSlug) return '';
  
  // Remove any UUID that might be present
  const baseSlug = urlSlug.split('__')[0];
  
  return baseSlug
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse a slug that might contain a UUID
 * Format: base-slug__uuid
 */
export function parseSlugWithUUID(slug: string): { baseSlug: string; uuid: string | null } {
  if (!slug) {
    return { baseSlug: '', uuid: null };
  }
  
  const parts = slug.split('__');
  const baseSlug = parts[0];
  const uuid = parts.length > 1 ? parts[1] : null;
  
  return { baseSlug, uuid };
}

/**
 * Extract a UUID from a slug if present
 */
export function extractUUID(slug: string): string | null {
  const { uuid } = parseSlugWithUUID(slug);
  return uuid;
}

/**
 * Compare two slugs to see if they match, ignoring case and formatting differences
 */
export function slugsMatch(slug1: string, slug2: string): boolean {
  if (!slug1 || !slug2) return false;
  
  const normalized1 = mapUrlSlugToDatabaseSlug(slug1);
  const normalized2 = mapUrlSlugToDatabaseSlug(slug2);
  
  return normalized1 === normalized2;
}
