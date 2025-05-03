

/**
 * Utilities for generating and comparing slug variations
 * Refactored into smaller, focused modules
 */

import { normalizeSlug, getBasicVariations } from './common';
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
  
  // Add basic format variations (hyphen/underscore)
  variations.push(...getBasicVariations(slug));
  
  // Add special case variations
  variations.push(...getSpecialCaseVariations(slug));
  
  // Add word-specific variations
  variations.push(...getWordSpecificVariations(slug));
  
  // Special case for marketing-promotions vs marketing-and-promotions
  const normalizedSlug = normalizeSlug(slug);
  if (normalizedSlug === 'marketing-promotions') {
    variations.push('marketing-and-promotions');
  } else if (normalizedSlug === 'marketing-and-promotions') {
    variations.push('marketing-promotions');
  }
  
  // Remove duplicates
  return [...new Set(variations)];
}

// Re-export functions from other modules
export {
  normalizeSlug,
  slugsMatch,
  findBestSlugMatch
};

