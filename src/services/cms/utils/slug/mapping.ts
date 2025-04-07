/**
 * Slug mapping utilities - handles mapping between URL and database slugs
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

import { normalizeSlug } from './normalize';

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
