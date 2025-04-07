/**
 * Utilities for working with UUIDs in slugs
 */

/**
 * Extract and normalize a UUID from a mixed string format
 * This allows for product identification by UUID even if the slug changes
 * @param input String that might contain a UUID
 * @returns Extracted UUID or null if not found
 */
export function extractUUID(input: string): string | null {
  // UUID pattern: 8-4-4-4-12 hexadecimal characters
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = input && input.match(uuidPattern);
  
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  
  return null;
}

/**
 * Create a SEO-friendly URL that includes both slug and UUID
 * Format: slug--uuid
 * @param slug SEO-friendly slug
 * @param uuid Product UUID
 * @returns Combined slug with UUID
 */
export function createSlugWithUUID(slug: string, uuid: string): string {
  const { normalizeSlug } = require('./normalize');
  const normalizedSlug = normalizeSlug(slug);
  return `${normalizedSlug}--${uuid}`;
}

/**
 * Parse a combined slug-UUID to extract both components
 * @param combinedSlug Combined slug in format "slug--uuid"
 * @returns Object containing separated slug and UUID
 */
export function parseSlugWithUUID(combinedSlug: string): {slug: string, uuid: string | null} {
  if (!combinedSlug) {
    return { slug: '', uuid: null };
  }
  
  const { normalizeSlug } = require('./normalize');
  
  // Try to extract UUID from combined format
  const parts = combinedSlug.split('--');
  
  if (parts.length >= 2) {
    const uuid = extractUUID(parts[parts.length - 1]);
    // Join all parts except the last one (which is the UUID)
    const slug = parts.slice(0, parts.length - 1).join('--');
    return { slug: normalizeSlug(slug), uuid };
  }
  
  // Check if the whole string is a UUID
  const uuid = extractUUID(combinedSlug);
  if (uuid) {
    return { slug: '', uuid };
  }
  
  // Otherwise just return the normalized slug
  return { slug: normalizeSlug(combinedSlug), uuid: null };
}
