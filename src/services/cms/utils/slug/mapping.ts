
import { normalizeSlug } from './normalize';
import { getSlugVariations, slugsMatch } from './variations';

/**
 * Maps from URL-friendly slugs to database slugs
 */
const urlToDbSlugMap: Record<string, string> = {};

/**
 * Maps from database slugs to URL-friendly slugs
 */
const dbToUrlSlugMap: Record<string, string> = {};

/**
 * Register a slug change mapping between URL and database
 * @param urlSlug The slug used in URLs
 * @param dbSlug The slug used in database
 */
export function registerSlugChange(urlSlug: string, dbSlug: string): void {
  const normalizedUrlSlug = normalizeSlug(urlSlug);
  const normalizedDbSlug = normalizeSlug(dbSlug);
  
  urlToDbSlugMap[normalizedUrlSlug] = normalizedDbSlug;
  dbToUrlSlugMap[normalizedDbSlug] = normalizedUrlSlug;
  
  console.log(`[slugMapping] Registered mapping: URL '${normalizedUrlSlug}' -> DB '${normalizedDbSlug}'`);
}

/**
 * Maps a URL-friendly slug to a database slug
 * @param urlSlug The slug from the URL
 * @returns The corresponding database slug
 */
export function mapUrlSlugToDatabaseSlug(urlSlug: string): string {
  const normalizedSlug = normalizeSlug(urlSlug);
  
  // If we have an exact mapping, use it
  if (urlToDbSlugMap[normalizedSlug]) {
    return urlToDbSlugMap[normalizedSlug];
  }
  
  // Try variations
  const variations = getSlugVariations(normalizedSlug);
  for (const variation of variations) {
    if (urlToDbSlugMap[variation]) {
      // Add this mapping for future use
      registerSlugChange(normalizedSlug, urlToDbSlugMap[variation]);
      return urlToDbSlugMap[variation];
    }
  }
  
  // Check for fuzzy matches if no exact match was found
  for (const mappedUrlSlug in urlToDbSlugMap) {
    if (slugsMatch(normalizedSlug, mappedUrlSlug)) {
      // Register this fuzzy match for future use
      registerSlugChange(normalizedSlug, urlToDbSlugMap[mappedUrlSlug]);
      return urlToDbSlugMap[mappedUrlSlug];
    }
  }
  
  // No mapping found, return the original (normalized)
  return normalizedSlug;
}

/**
 * Maps a database slug to a URL-friendly slug
 * @param dbSlug The slug from the database
 * @returns The corresponding URL-friendly slug
 */
export function mapDatabaseSlugToUrlSlug(dbSlug: string): string {
  const normalizedSlug = normalizeSlug(dbSlug);
  
  // If we have an exact mapping, use it
  if (dbToUrlSlugMap[normalizedSlug]) {
    return dbToUrlSlugMap[normalizedSlug];
  }
  
  // Try variations
  const variations = getSlugVariations(normalizedSlug);
  for (const variation of variations) {
    if (dbToUrlSlugMap[variation]) {
      // Add this mapping for future use
      registerSlugChange(dbToUrlSlugMap[variation], normalizedSlug);
      return dbToUrlSlugMap[variation];
    }
  }
  
  // Check for fuzzy matches if no exact match was found
  for (const mappedDbSlug in dbToUrlSlugMap) {
    if (slugsMatch(normalizedSlug, mappedDbSlug)) {
      // Register this fuzzy match for future use
      registerSlugChange(dbToUrlSlugMap[mappedDbSlug], normalizedSlug);
      return dbToUrlSlugMap[mappedDbSlug];
    }
  }
  
  // No mapping found, return the original (normalized)
  return normalizedSlug;
}
