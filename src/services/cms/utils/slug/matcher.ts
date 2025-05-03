
/**
 * Slug matching logic for comparing and finding best matches
 */
import { normalizeSlug } from './common';
import { BUSINESS_GOAL_SLUG_MAP, COMMON_PREFIXES } from './common';

/**
 * Compare two slugs to see if they match, ignoring format differences
 * @param slugA First slug
 * @param slugB Second slug
 * @returns Whether the slugs match
 */
export function slugsMatch(slugA: string, slugB: string): boolean {
  if (!slugA || !slugB) return false;
  
  // Normalize both slugs to lowercase with hyphens
  const normalizedA = normalizeSlug(slugA);
  const normalizedB = normalizeSlug(slugB);
  
  // Enhanced special case matching for known problematic slugs
  for (const [targetSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    // Check if either slug is the target or in its variations
    if (normalizedA === targetSlug || variations.includes(normalizedA)) {
      if (normalizedB === targetSlug || variations.includes(normalizedB)) {
        return true;
      }
    }
  }
  
  // Special case for "marketing-and-promotions" vs "marketing-promotions"
  if ((normalizedA === 'marketing-and-promotions' && normalizedB === 'marketing-promotions') ||
      (normalizedA === 'marketing-promotions' && normalizedB === 'marketing-and-promotions')) {
    return true;
  }
  
  // Direct match
  if (normalizedA === normalizedB) return true;
  
  // Check if one has -vending suffix and the other doesn't
  if (normalizedA === `${normalizedB}-vending` || `${normalizedA}-vending` === normalizedB) return true;
  
  // Check for plural/singular variations
  if (normalizedA + 's' === normalizedB || normalizedA === normalizedB + 's') return true;
  
  // Check for common prefixes
  for (const prefix of COMMON_PREFIXES) {
    const prefixWithHyphen = `${prefix}-`;
    if (normalizedA === prefixWithHyphen + normalizedB || normalizedB === prefixWithHyphen + normalizedA) return true;
  }
  
  return false;
}

/**
 * Find the best matching slug from a list of available slugs
 * @param searchSlug The slug to search for
 * @param allSlugs Array of all available slugs to match against
 * @returns The best matching slug, or null if no match found
 */
export function findBestSlugMatch(searchSlug: string, allSlugs: string[]): string | null {
  if (!searchSlug || !allSlugs || allSlugs.length === 0) return null;
  
  // Normalize the search slug
  const normalizedSearchSlug = normalizeSlug(searchSlug);
  
  // Special case handling for specific business goals
  for (const [targetSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    if (variations.includes(normalizedSearchSlug)) {
      // Find the actual slug that best matches our target
      const matchingSlug = allSlugs.find(slug => {
        const normalizedSlug = normalizeSlug(slug);
        return normalizedSlug === targetSlug || variations.includes(normalizedSlug);
      });
      
      if (matchingSlug) {
        console.log(`[findBestSlugMatch] Special case match found for "${normalizedSearchSlug}" -> "${matchingSlug}"`);
        return matchingSlug;
      }
    }
  }
  
  // First try direct match
  const directMatch = allSlugs.find(slug => normalizeSlug(slug) === normalizedSearchSlug);
  if (directMatch) return directMatch;
  
  // Then try variations with slugsMatch
  for (const candidateSlug of allSlugs) {
    if (slugsMatch(normalizedSearchSlug, candidateSlug)) {
      return candidateSlug;
    }
  }
  
  // Try partial matching as last resort (if slug contains the search term)
  const partialMatch = allSlugs.find(slug => 
    normalizeSlug(slug).includes(normalizedSearchSlug) || 
    normalizedSearchSlug.includes(normalizeSlug(slug))
  );
  
  return partialMatch || null;
}
