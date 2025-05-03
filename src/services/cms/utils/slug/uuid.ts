
/**
 * Utilities for working with UUIDs in slugs
 */

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extract a UUID from a slug if present
 * @param slug The slug that may contain a UUID
 * @returns The UUID if found, otherwise null
 */
export function extractUUID(slug: string): string | null {
  if (!slug) return null;
  
  // Check if the slug itself is a UUID
  if (UUID_PATTERN.test(slug)) {
    return slug;
  }
  
  // Check for slug-uuid format
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  if (UUID_PATTERN.test(lastPart)) {
    return lastPart;
  }
  
  return null;
}

/**
 * Create a slug with a UUID appended
 * @param baseSlug The base slug
 * @param uuid The UUID to append
 * @returns A slug with the UUID appended
 */
export function createSlugWithUUID(baseSlug: string, uuid: string): string {
  return `${baseSlug}-${uuid}`;
}

/**
 * Parse a slug with a UUID to extract both parts
 * @param slug The slug with a UUID
 * @returns An object with the base slug and UUID
 */
export function parseSlugWithUUID(slug: string): { baseSlug: string; uuid: string | null } {
  const uuid = extractUUID(slug);
  
  if (!uuid) {
    return { baseSlug: slug, uuid: null };
  }
  
  // Remove the UUID from the slug
  const baseSlug = slug.replace(`-${uuid}`, '');
  
  return { baseSlug, uuid };
}
