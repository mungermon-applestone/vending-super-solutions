
/**
 * Slug matching logic for comparing and finding best matches
 */
import { normalizeSlug, getCanonicalSlug, BUSINESS_GOAL_SLUG_MAP } from './common';

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
  
  // Direct match
  if (normalizedA === normalizedB) {
    console.log(`[slugsMatch] Direct match found: "${normalizedA}" = "${normalizedB}"`);
    return true;
  }
  
  // Check if they have the same canonical form
  const canonicalA = getCanonicalSlug(normalizedA);
  const canonicalB = getCanonicalSlug(normalizedB);
  
  if (canonicalA === canonicalB) {
    console.log(`[slugsMatch] Canonical match found: "${normalizedA}" and "${normalizedB}" both map to "${canonicalA}"`);
    return true;
  }
  
  // No match found
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
  
  // First try: direct match
  const directMatch = allSlugs.find(slug => normalizeSlug(slug) === normalizedSearchSlug);
  if (directMatch) {
    console.log(`[findBestSlugMatch] Direct match found: ${directMatch}`);
    return directMatch;
  }
  
  // Second try: canonical form matching
  const canonicalSearchSlug = getCanonicalSlug(normalizedSearchSlug);
  
  // Try to find a slug with the same canonical form
  for (const candidateSlug of allSlugs) {
    const canonicalCandidateSlug = getCanonicalSlug(candidateSlug);
    if (canonicalSearchSlug === canonicalCandidateSlug) {
      console.log(`[findBestSlugMatch] Canonical match found: ${candidateSlug} (maps to ${canonicalCandidateSlug})`);
      return candidateSlug;
    }
  }
  
  // Last resort: try slugsMatch function
  for (const candidateSlug of allSlugs) {
    if (slugsMatch(normalizedSearchSlug, candidateSlug)) {
      console.log(`[findBestSlugMatch] Found match via slugsMatch: ${candidateSlug}`);
      return candidateSlug;
    }
  }
  
  console.log(`[findBestSlugMatch] No match found for "${normalizedSearchSlug}"`);
  return null;
}
