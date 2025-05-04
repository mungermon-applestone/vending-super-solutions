
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
  // IMPORTANT: marketing-and-promotions is the canonical form in URLs
  'marketing-and-promotions': ['marketing_and_promotions', 'marketing-promotions', 'marketing_promotions', 'marketing', 'promotions'],
  'fleet-management': ['fleet_management', 'fleet'],
  'customer-satisfaction': ['customer_satisfaction', 'satisfaction', 'customer-experience'],
  'bopis': ['buy-online-pickup-in-store', 'buy_online_pickup_in_store']
};

/**
 * Direct mapping from any possible slug variation to canonical form
 * This is a flattened version of BUSINESS_GOAL_SLUG_MAP for quicker lookups
 */
export const CANONICAL_SLUG_MAP: Record<string, string> = {};

// Initialize the canonical map
Object.entries(BUSINESS_GOAL_SLUG_MAP).forEach(([canonical, variations]) => {
  // Add the canonical form mapping to itself
  CANONICAL_SLUG_MAP[canonical] = canonical;
  
  // Add each variation mapping to the canonical form
  variations.forEach(variation => {
    CANONICAL_SLUG_MAP[variation] = canonical;
  });
});

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
 * Get the canonical form of a slug
 * @param slug Any form of a slug (normalized or not)
 * @returns The canonical form, or the original slug if no canonical form exists
 */
export function getCanonicalSlug(slug: string): string {
  if (!slug) return '';
  
  const normalizedSlug = normalizeSlug(slug);
  return CANONICAL_SLUG_MAP[normalizedSlug] || normalizedSlug;
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
