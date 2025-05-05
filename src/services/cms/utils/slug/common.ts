/**
 * Common slug utilities
 * Contains shared functionality for slug normalization and mapping
 */

// Define mapping of business goal slugs to their canonical forms
export const BUSINESS_GOAL_SLUG_MAP: Record<string, string> = {
  'cost-reduction': 'reduce-costs',
  'cost-efficiency': 'reduce-costs',
  'save-money': 'reduce-costs',
  'revenue-growth': 'increase-revenue',
  'grow-revenue': 'increase-revenue',
  'boost-sales': 'increase-revenue',
  'customer-experience': 'improve-customer-experience',
  'cx-improvement': 'improve-customer-experience',
  'operational-efficiency': 'improve-operations',
  'efficiency': 'improve-operations',
  'streamline': 'improve-operations',
  'sustainability': 'environmental-sustainability',
  'eco-friendly': 'environmental-sustainability',
  'green-initiatives': 'environmental-sustainability',
  'data-insights': 'data-analytics',
  'analytics': 'data-analytics',
  'business-intelligence': 'data-analytics',
  
  'expand': 'expand-footprint',
  'footprint': 'expand-footprint',
  'expand-business': 'expand-footprint',
  'growth-expansion': 'expand-footprint',
  'expansion': 'expand-footprint',
  'grow-footprint': 'expand-footprint'
};

// Define a map of canonical slugs
export const CANONICAL_SLUG_MAP: Record<string, string> = {
  ...BUSINESS_GOAL_SLUG_MAP
};

// Common prefixes that might be added to slugs
export const COMMON_PREFIXES = [
  'vending-',
  'vending-machine-',
  'smart-',
  'smart-vending-',
  'automated-',
  'automated-retail-',
  'self-service-',
  'unattended-',
  'micro-market-',
  'intelligent-'
];

/**
 * Normalize a slug by converting to lowercase, replacing spaces with hyphens,
 * and removing special characters
 * @param slug The original slug
 * @returns A normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')     // Replace multiple hyphens with single
    .replace(/^-+/, '')         // Trim hyphens from start of text
    .replace(/-+$/, '');        // Trim hyphens from end of text
}

/**
 * Get the canonical form of a slug if it exists in the mapping
 * @param slug The normalized slug to check
 * @returns The canonical form or the original slug if no mapping exists
 */
export function getCanonicalSlug(slug: string): string {
  if (!slug) return '';
  
  // Check if the slug has a canonical form
  return CANONICAL_SLUG_MAP[slug] || slug;
}

/**
 * Generate basic variations of a slug
 * @param slug The original slug
 * @returns An array of basic slug variations
 */
export function getBasicVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [];
  
  // Try replacing hyphens with underscores and vice versa
  if (slug.includes('-')) {
    variations.push(slug.replace(/-/g, '_'));
  }
  
  if (slug.includes('_')) {
    variations.push(slug.replace(/_/g, '-'));
  }
  
  // Try with and without common prefixes
  const normalizedSlug = normalizeSlug(slug);
  
  for (const prefix of COMMON_PREFIXES) {
    if (normalizedSlug.startsWith(prefix)) {
      // Try without the prefix
      variations.push(normalizedSlug.substring(prefix.length));
    } else {
      // Try with the prefix
      variations.push(prefix + normalizedSlug);
    }
  }
  
  return variations;
}

/**
 * Special handling for hardcoded important slugs
 * This is a fallback for critical business goals that must be available
 * @param slug The slug to check
 * @returns The hardcoded slug if it's a known critical slug, otherwise the original
 */
export function getHardcodedSlug(slug: string): string | null {
  // Special case for expand-footprint
  if (slug === 'expand-footprint' || 
      slug.includes('expand') || 
      slug.includes('footprint')) {
    console.log(`[getHardcodedSlug] Converting "${slug}" to hardcoded "expand-footprint"`);
    return 'expand-footprint';
  }
  
  // Add other critical business goals here
  
  return null;
}

/**
 * Log a slug operation for debugging purposes
 * @param operation The operation being performed
 * @param details Additional details about the operation
 */
export function logSlugOperation(operation: string, details: Record<string, any>): void {
  console.log(`[SlugOperation:${operation}]`, details);
}
