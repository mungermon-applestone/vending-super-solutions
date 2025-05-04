
/**
 * Common slug variation utilities and constants
 */

/**
 * Special case mapping for known business goal slugs
 * The key is the canonical URL slug, values are alternative forms that might exist in the database
 */
export const BUSINESS_GOAL_SLUG_MAP: Record<string, string[]> = {
  'data-analytics': ['data_analytics', 'analytics', 'data-analysis', 'data'],
  'expand-footprint': ['expand_footprint', 'expansion', 'market-expansion', 'footprint'],
  // IMPORTANT: marketing-and-promotions is the canonical form in URLs, but marketing-promotions may exist in the database
  'marketing-and-promotions': ['marketing_and_promotions', 'marketing-promotions', 'marketing_promotions', 'marketing', 'promotions']
};

/**
 * Industry-specific prefixes that might be used in slugs
 */
export const COMMON_PREFIXES = ['retail', 'micro', 'smart'];

/**
 * Simple normalization function for slugs
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  return slug.toLowerCase().replace(/_/g, '-').trim();
}

/**
 * Handles basic format conversions between slug formats
 * @param slug The slug to convert
 * @returns Array of basic variations
 */
export function getBasicVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [slug];
  
  // Add hyphen version
  const hyphenVersion = slug.replace(/_/g, '-');
  if (!variations.includes(hyphenVersion)) {
    variations.push(hyphenVersion);
  }
  
  // Add underscore version
  const underscoreVersion = slug.replace(/-/g, '_');
  if (!variations.includes(underscoreVersion)) {
    variations.push(underscoreVersion);
  }
  
  return variations;
}

/**
 * Log details about slug operations for debugging
 * @param operation The operation being performed
 * @param slug The slug being operated on
 * @param details Additional details about the operation
 */
export function logSlugOperation(operation: string, slug: string, details?: any): void {
  console.log(`[SlugUtils:${operation}] ${slug}${details ? ` - ${JSON.stringify(details)}` : ''}`);
}
