
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
  
  // Log for debugging
  console.log(`[slugsMatch] Comparing: "${normalizedA}" and "${normalizedB}"`);
  
  // Enhanced special case matching for known problematic slugs
  for (const [targetSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    // Check if either slug is the target or in its variations
    if (normalizedA === targetSlug || variations.includes(normalizedA)) {
      if (normalizedB === targetSlug || variations.includes(normalizedB)) {
        console.log(`[slugsMatch] Match found via special case mapping for ${normalizedA} and ${normalizedB}`);
        return true;
      }
    }
  }
  
  // Special case for "marketing-and-promotions" vs "marketing-promotions"
  if ((normalizedA === 'marketing-and-promotions' && normalizedB === 'marketing-promotions') ||
      (normalizedA === 'marketing-promotions' && normalizedB === 'marketing-and-promotions')) {
    console.log(`[slugsMatch] Marketing special case match found for ${normalizedA} and ${normalizedB}`);
    return true;
  }
  
  // Direct match
  if (normalizedA === normalizedB) {
    console.log(`[slugsMatch] Direct match found for ${normalizedA}`);
    return true;
  }
  
  // Check if one has -vending suffix and the other doesn't
  if (normalizedA === `${normalizedB}-vending` || `${normalizedA}-vending` === normalizedB) {
    console.log(`[slugsMatch] Vending suffix match found for ${normalizedA} and ${normalizedB}`);
    return true;
  }
  
  // Check for plural/singular variations
  if (normalizedA + 's' === normalizedB || normalizedA === normalizedB + 's') {
    console.log(`[slugsMatch] Plural/singular match found for ${normalizedA} and ${normalizedB}`);
    return true;
  }
  
  // Check for common prefixes
  for (const prefix of COMMON_PREFIXES) {
    const prefixWithHyphen = `${prefix}-`;
    if (normalizedA === prefixWithHyphen + normalizedB || normalizedB === prefixWithHyphen + normalizedA) {
      console.log(`[slugsMatch] Prefix match found for ${normalizedA} and ${normalizedB} with prefix ${prefix}`);
      return true;
    }
  }
  
  console.log(`[slugsMatch] No match found for ${normalizedA} and ${normalizedB}`);
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
  
  console.log(`[findBestSlugMatch] Searching for best match for "${searchSlug}" among ${allSlugs.length} slugs`);
  
  // Normalize the search slug
  const normalizedSearchSlug = normalizeSlug(searchSlug);
  
  // Special case handling for marketing-and-promotions vs marketing-promotions
  if (normalizedSearchSlug === 'marketing-and-promotions' || normalizedSearchSlug === 'marketing-promotions') {
    console.log('[findBestSlugMatch] Using special case handling for marketing/promotions');
    const marketingMatch = allSlugs.find(slug => {
      const normalizedSlug = normalizeSlug(slug);
      return normalizedSlug === 'marketing-promotions' || normalizedSlug === 'marketing-and-promotions';
    });
    
    if (marketingMatch) {
      console.log(`[findBestSlugMatch] Found marketing/promotions match: ${marketingMatch}`);
      return marketingMatch;
    }
  }
  
  // Special case handling for specific business goals
  for (const [targetSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    if (variations.includes(normalizedSearchSlug) || targetSlug === normalizedSearchSlug) {
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
  if (directMatch) {
    console.log(`[findBestSlugMatch] Direct match found: ${directMatch}`);
    return directMatch;
  }
  
  // Then try variations with slugsMatch
  for (const candidateSlug of allSlugs) {
    if (slugsMatch(normalizedSearchSlug, candidateSlug)) {
      console.log(`[findBestSlugMatch] Found match via slugsMatch: ${candidateSlug}`);
      return candidateSlug;
    }
  }
  
  // Try partial matching as last resort (if slug contains the search term)
  const partialMatch = allSlugs.find(slug => 
    normalizeSlug(slug).includes(normalizedSearchSlug) || 
    normalizedSearchSlug.includes(normalizeSlug(slug))
  );
  
  if (partialMatch) {
    console.log(`[findBestSlugMatch] Found partial match: ${partialMatch}`);
  } else {
    console.log(`[findBestSlugMatch] No match found for "${normalizedSearchSlug}"`);
  }
  
  return partialMatch || null;
}
