
/**
 * Utility functions for slug matching and normalization
 */

// Map of URL slugs to database slugs
// This is a one-way mapping from URL slug to database slug
const slugMappings: Record<string, string> = {
  'grocery': 'grocery-vending',
  'cannabis': 'cannabis-vending',
  'vape': 'vape-vending',
  'cosmetics': 'cosmetics-vending',
  'otc': 'over-the-counter-pharma-vending',
  'collectibles': 'toys-cards-collectibles'  // Updated to match the database slug
};

// Map for the reverse lookup (database slug to URL slug)
// This helps avoid circular references
const reverseMappings: Record<string, string> = {
  'grocery-vending': 'grocery',
  'cannabis-vending': 'cannabis',
  'vape-vending': 'vape',
  'cosmetics-vending': 'cosmetics',
  'over-the-counter-pharma-vending': 'otc',
  'toys-cards-collectibles': 'collectibles' // Updated to match the URL slug
};

// Track historical slugs that may have changed - maps old slugs to current slugs
// This allows products to be found even if their slug has changed
const historicalSlugs: Record<string, string> = {
  // Example: 'old-product-slug': 'new-product-slug'
};

/**
 * Normalize a slug by converting to lowercase, trimming and handling special cases
 * @param slug The slug to normalize
 * @returns Normalized slug
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
 * Map a URL slug to its corresponding database slug if a mapping exists
 * @param slug The URL slug to map
 * @returns The database slug or the original slug if no mapping exists
 */
export function mapUrlSlugToDatabaseSlug(slug: string): string {
  const normalizedSlug = normalizeSlug(slug);
  console.log(`[slugMatching] Mapping URL slug: "${normalizedSlug}" to database slug`);
  
  // Check for direct mapping
  if (slugMappings[normalizedSlug]) {
    console.log(`[slugMatching] Found mapping: "${normalizedSlug}" -> "${slugMappings[normalizedSlug]}"`);
    return slugMappings[normalizedSlug];
  }
  
  // Check historical slugs if no direct mapping found
  if (historicalSlugs[normalizedSlug]) {
    const currentSlug = historicalSlugs[normalizedSlug];
    console.log(`[slugMatching] Found historical mapping: "${normalizedSlug}" -> "${currentSlug}"`);
    
    // If the current slug has a database mapping, use that
    if (slugMappings[currentSlug]) {
      return slugMappings[currentSlug];
    }
    
    // Otherwise return the current slug
    return currentSlug;
  }
  
  console.log(`[slugMatching] No mapping found for slug: "${normalizedSlug}", using as-is`);
  return normalizedSlug;
}

/**
 * Map a database slug to its corresponding URL slug
 * @param slug The database slug to map
 * @returns The URL slug or the original slug if no mapping exists
 */
export function mapDatabaseSlugToUrlSlug(slug: string): string {
  const normalizedSlug = normalizeSlug(slug);
  
  if (reverseMappings[normalizedSlug]) {
    console.log(`[slugMatching] Reverse mapping: "${normalizedSlug}" -> "${reverseMappings[normalizedSlug]}"`);
    return reverseMappings[normalizedSlug];
  }
  
  return normalizedSlug;
}

/**
 * Register a slug change to help with lookups
 * @param oldSlug The previous slug
 * @param newSlug The new slug
 */
export function registerSlugChange(oldSlug: string, newSlug: string): void {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  
  const normalizedOld = normalizeSlug(oldSlug);
  const normalizedNew = normalizeSlug(newSlug);
  
  console.log(`[slugMatching] Registering slug change: "${normalizedOld}" -> "${normalizedNew}"`);
  historicalSlugs[normalizedOld] = normalizedNew;
}

/**
 * Get all possible slug variations to try
 * @param slug The original slug
 * @returns Array of possible slug variations to try
 */
export function getSlugVariations(slug: string): string[] {
  const normalizedSlug = normalizeSlug(slug);
  
  // Start with an empty set to avoid duplicates
  const variationsSet = new Set<string>();
  
  // Add the normalized original slug
  variationsSet.add(normalizedSlug);
  
  // Add mapped version if exists (URL slug to database slug)
  const mappedSlug = mapUrlSlugToDatabaseSlug(normalizedSlug);
  if (mappedSlug !== normalizedSlug) {
    variationsSet.add(mappedSlug);
  }
  
  // Check historical slugs
  if (historicalSlugs[normalizedSlug]) {
    const currentSlug = historicalSlugs[normalizedSlug];
    variationsSet.add(currentSlug);
    
    // If the current slug has a database mapping, add that too
    if (slugMappings[currentSlug]) {
      variationsSet.add(slugMappings[currentSlug]);
    }
  }
  
  // Special case for OTC - always include the exact database slug
  if (normalizedSlug === 'otc' || normalizedSlug === 'otc-vending') {
    variationsSet.add('over-the-counter-pharma-vending');
  }
  
  // Add/remove -vending suffix for both original and mapped slugs
  if (normalizedSlug.endsWith('-vending')) {
    // If it ends with -vending, also try without it
    variationsSet.add(normalizedSlug.replace('-vending', ''));
  } else {
    // If it doesn't end with -vending, also try with it
    variationsSet.add(`${normalizedSlug}-vending`);
  }
  
  // Convert Set back to array
  const variations = Array.from(variationsSet);
  
  console.log(`[slugMatching] Generated variations for "${slug}":`, variations);
  return variations;
}

/**
 * Compare two slugs for exact match (case-insensitive)
 * @param slug1 First slug to compare
 * @param slug2 Second slug to compare
 * @returns Boolean indicating if slugs match
 */
export function exactSlugMatch(slug1: string, slug2: string): boolean {
  const normalizedSlug1 = normalizeSlug(slug1);
  const normalizedSlug2 = normalizeSlug(slug2);
  return normalizedSlug1 === normalizedSlug2;
}

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

/**
 * Log details about slug search for debugging
 * @param slug The slug being searched
 * @param searchType The type of search being performed
 */
export function logSlugSearch(slug: string, searchType: string): void {
  console.log(`[fetchFromCMS] ${searchType} for slug: "${slug}"`);
}

/**
 * Log the result of a slug search
 * @param slug The slug that was searched
 * @param result The result of the search
 * @param matchType The type of match found
 */
export function logSlugResult(slug: string, result: any, matchType: string): void {
  if (result && result.length > 0) {
    console.log(`[fetchFromCMS] ${matchType} match found for "${slug}": "${result[0].title || 'untitled'}"`);
  } else {
    console.log(`[fetchFromCMS] No ${matchType} match found for "${slug}"`);
  }
}
