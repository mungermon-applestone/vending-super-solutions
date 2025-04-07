
/**
 * Utilities for generating and working with slug variations
 */

import { normalizeSlug } from './normalize';
import { mapUrlSlugToDatabaseSlug } from './mapping';

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
  // (This relies on the import from mapping.ts which already handles historical slugs)
  
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
