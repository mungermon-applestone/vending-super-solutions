
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
  
  // Critical special case for marketing-and-promotions vs marketing-promotions
  if ((normalizedA === 'marketing-and-promotions' && normalizedB === 'marketing-promotions') ||
      (normalizedA === 'marketing-promotions' && normalizedB === 'marketing-and-promotions')) {
    console.log(`[slugsMatch] Marketing special case match found: "${normalizedA}" matches "${normalizedB}"`);
    return true;
  }
  
  // Enhanced special case matching for known problematic slugs
  for (const [canonicalSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    // Check if either slug is the canonical form or in its variations
    if (normalizedA === canonicalSlug || variations.includes(normalizedA)) {
      if (normalizedB === canonicalSlug || variations.includes(normalizedB)) {
        console.log(`[slugsMatch] Match found via special case mapping: "${normalizedA}" matches "${normalizedB}"`);
        return true;
      }
    }
  }
  
  // Direct match
  if (normalizedA === normalizedB) {
    console.log(`[slugsMatch] Direct match found: "${normalizedA}" = "${normalizedB}"`);
    return true;
  }
  
  // Check if one has -vending suffix and the other doesn't
  if (normalizedA === `${normalizedB}-vending` || `${normalizedA}-vending` === normalizedB) {
    console.log(`[slugsMatch] Vending suffix match found: "${normalizedA}" matches "${normalizedB}"`);
    return true;
  }
  
  // Check for plural/singular variations
  if (normalizedA + 's' === normalizedB || normalizedA === normalizedB + 's') {
    console.log(`[slugsMatch] Plural/singular match found: "${normalizedA}" matches "${normalizedB}"`);
    return true;
  }
  
  // Check for common prefixes
  for (const prefix of COMMON_PREFIXES) {
    const prefixWithHyphen = `${prefix}-`;
    if (normalizedA === prefixWithHyphen + normalizedB || normalizedB === prefixWithHyphen + normalizedA) {
      console.log(`[slugsMatch] Prefix match found: "${normalizedA}" matches "${normalizedB}" with prefix ${prefix}`);
      return true;
    }
  }
  
  console.log(`[slugsMatch] No match found between "${normalizedA}" and "${normalizedB}"`);
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
  
  // Critical special case handling for marketing-and-promotions vs marketing-promotions
  if (normalizedSearchSlug === 'marketing-and-promotions' || normalizedSearchSlug === 'marketing-promotions') {
    console.log('[findBestSlugMatch] Using special case handling for marketing/promotions');
    
    // First look for marketing-and-promotions (URL canonical form)
    let marketingMatch = allSlugs.find(slug => normalizeSlug(slug) === 'marketing-and-promotions');
    
    // If not found, try marketing-promotions (possible DB form)
    if (!marketingMatch) {
      marketingMatch = allSlugs.find(slug => normalizeSlug(slug) === 'marketing-promotions');
    }
    
    // If either form is found, return it
    if (marketingMatch) {
      console.log(`[findBestSlugMatch] Found marketing/promotions match: ${marketingMatch}`);
      return marketingMatch;
    }
  }
  
  // Special case handling for specific business goals
  for (const [canonicalSlug, variations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    if (canonicalSlug === normalizedSearchSlug || variations.includes(normalizedSearchSlug)) {
      console.log(`[findBestSlugMatch] Search slug "${normalizedSearchSlug}" matches canonical slug "${canonicalSlug}" or its variations`);
      
      // First try to find the exact canonical form
      const exactCanonicalMatch = allSlugs.find(slug => normalizeSlug(slug) === canonicalSlug);
      if (exactCanonicalMatch) {
        console.log(`[findBestSlugMatch] Found exact canonical match: ${exactCanonicalMatch}`);
        return exactCanonicalMatch;
      }
      
      // If canonical form not found, try any of its variations
      for (const variation of variations) {
        const variationMatch = allSlugs.find(slug => normalizeSlug(slug) === variation);
        if (variationMatch) {
          console.log(`[findBestSlugMatch] Found variation match: ${variationMatch} for canonical slug ${canonicalSlug}`);
          return variationMatch;
        }
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
