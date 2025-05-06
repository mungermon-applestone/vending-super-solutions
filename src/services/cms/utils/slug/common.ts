
/**
 * Common utilities for slug handling
 */

// Define the canonical business goal slugs
export const BUSINESS_GOAL_SLUG_MAP: Record<string, string> = {
  // Original slugs mapped to canonical versions
  'marketing': 'marketing-and-promotions',
  'marketing-promotions': 'marketing-and-promotions',
  'marketing-&-promotions': 'marketing-and-promotions',
  'data': 'data-analytics',
  'data-&-analytics': 'data-analytics',
  'bopis': 'bopis',
  'pickup': 'bopis',
  'buy-online-pickup': 'bopis',
  'expand': 'expand-footprint',
  'footprint': 'expand-footprint',
  'fleet': 'fleet-management',
  'fleet-mgmt': 'fleet-management',
  'customer': 'customer-satisfaction',
  'satisfaction': 'customer-satisfaction'
};

// Canonical slug map for all content types (can be expanded later)
export const CANONICAL_SLUG_MAP: Record<string, string> = {
  ...BUSINESS_GOAL_SLUG_MAP,
};

// Common URL prefixes to strip from slugs for normalization
export const COMMON_PREFIXES = [
  'business-goals/',
  'business/',
  'goals/'
];

/**
 * Normalizes a slug by converting to lowercase, replacing spaces with hyphens,
 * and removing any special characters
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Remove any URL path prefixes
  let normalizedSlug = slug;
  COMMON_PREFIXES.forEach(prefix => {
    if (normalizedSlug.startsWith(prefix)) {
      normalizedSlug = normalizedSlug.substring(prefix.length);
    }
  });
  
  // Basic normalization: lowercase, replace spaces with hyphens, remove special chars
  normalizedSlug = normalizedSlug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')           // Trim hyphens from start
    .replace(/-+$/, '');          // Trim hyphens from end
    
  return normalizedSlug;
}

/**
 * Gets the canonical version of a slug if it exists in the mapping
 */
export function getCanonicalSlug(normalizedSlug: string): string {
  return CANONICAL_SLUG_MAP[normalizedSlug] || normalizedSlug;
}

/**
 * Gets basic variations of a slug for fuzzy matching
 */
export function getBasicVariations(slug: string): string[] {
  const normalizedSlug = normalizeSlug(slug);
  const variations = [normalizedSlug];
  
  // Add variations with and without hyphens
  if (normalizedSlug.includes('-')) {
    variations.push(normalizedSlug.replace(/-/g, ''));
  }
  
  // Add canonical version if it exists and is different
  const canonicalSlug = getCanonicalSlug(normalizedSlug);
  if (canonicalSlug !== normalizedSlug) {
    variations.push(canonicalSlug);
  }
  
  return variations;
}

/**
 * Log slug operations for debugging
 */
export function logSlugOperation(operation: string, details: Record<string, any>): void {
  console.log(`[Slug ${operation}]`, details);
}
