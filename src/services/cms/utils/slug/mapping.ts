/**
 * Utilities for mapping between URL slugs and database slugs
 */
 
// Keep track of known slug mappings for quicker lookups
const slugMappingCache: Record<string, string> = {};

/**
 * Maps a URL-friendly slug to a database slug format
 * @param urlSlug The slug as it appears in the URL
 * @returns The slug as it should be stored in the database
 */
export function mapUrlSlugToDatabaseSlug(urlSlug: string): string {
  // First check cache
  if (slugMappingCache[urlSlug]) {
    return slugMappingCache[urlSlug];
  }
  
  // Convert hyphens to underscores (common database convention)
  let dbSlug = urlSlug.replace(/-/g, '_');
  
  // Store in cache for future lookups
  slugMappingCache[urlSlug] = dbSlug;
  
  return dbSlug;
}

/**
 * Maps a database slug to a URL-friendly slug
 * @param dbSlug The slug as stored in the database
 * @returns The slug as it should appear in the URL
 */
export function mapDatabaseSlugToUrlSlug(dbSlug: string): string {
  // Convert underscores to hyphens (URL convention)
  return dbSlug.replace(/_/g, '-');
}

/**
 * Register a slug change in the mapping cache
 * @param oldSlug The old slug
 * @param newSlug The new slug
 */
export function registerSlugChange(oldSlug: string, newSlug: string): void {
  console.log(`[SlugMapping] Registering slug change: "${oldSlug}" -> "${newSlug}"`);
  slugMappingCache[oldSlug] = newSlug;
}
