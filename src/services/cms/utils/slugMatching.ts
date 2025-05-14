
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
 * Normalize a slug by removing special characters and standardizing format
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
 * Get canonical form of a slug (the preferred form for URLs)
 */
export function getCanonicalSlug(slug: string): string {
  if (!slug) return '';

  // Normalize first
  const normalizedSlug = normalizeSlug(slug);
  
  // Apply any specific business rules for canonical form
  // For example, ensure consistent separator usage
  return normalizedSlug.replace(/_/g, '-');
}

/**
 * Resolve a slug to its canonical form, considering any aliases or redirects
 */
export function resolveSlug(slug: string): string {
  if (!slug) return '';
  
  // First normalize the slug
  const normalizedSlug = normalizeSlug(slug);
  
  // Get canonical form
  return getCanonicalSlug(normalizedSlug);
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

/**
 * Generate variations of a slug to support fuzzy matching
 */
export function getSlugVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations = [slug];
  
  // Add or remove -vending suffix
  if (slug.endsWith('-vending')) {
    variations.push(slug.replace('-vending', ''));
  } else {
    variations.push(`${slug}-vending`);
  }
  
  // Handle common word separators (dash vs underscore)
  if (slug.includes('-')) {
    variations.push(slug.replace(/-/g, '_'));
  } else if (slug.includes('_')) {
    variations.push(slug.replace(/_/g, '-'));
  }
  
  // Handle common plural/singular variations
  if (slug.endsWith('s')) {
    variations.push(slug.slice(0, -1)); // Remove trailing 's'
  } else {
    variations.push(`${slug}s`); // Add trailing 's'
  }
  
  return [...new Set(variations)]; // Remove duplicates
}
