
/**
 * Utilities for generating and comparing slug variations
 * Refactored into smaller, focused modules
 */

import { normalizeSlug, getBasicVariations, getCanonicalSlug } from './common';
import { getSpecialCaseVariations, getWordSpecificVariations } from './specialCases';
import { slugsMatch, findBestSlugMatch } from './matcher';

/**
 * Generate variations of a slug to try different formats
 * @param slug The original slug
 * @returns An array of slug variations to try
 */
export function getSlugVariations(slug: string): string[] {
  if (!slug) return [];
  
  // Start with the original slug
  const variations: string[] = [slug];
  
  // Add normalized slug
  const normalizedSlug = normalizeSlug(slug);
  if (!variations.includes(normalizedSlug)) {
    variations.push(normalizedSlug);
  }
  
  // Add canonical slug if different
  const canonicalSlug = getCanonicalSlug(normalizedSlug);
  if (canonicalSlug !== normalizedSlug && !variations.includes(canonicalSlug)) {
    variations.push(canonicalSlug);
  }
  
  // Add basic format variations (hyphen/underscore)
  variations.push(...getBasicVariations(slug));
  
  // Add special case variations
  variations.push(...getSpecialCaseVariations(slug));
  
  // Add word-specific variations
  variations.push(...getWordSpecificVariations(slug));
  
  // Remove duplicates
  return [...new Set(variations)];
}

// Re-export functions from other modules
export {
  normalizeSlug,
  getCanonicalSlug,
  slugsMatch,
  findBestSlugMatch
};
