
/**
 * Utilities for generating and comparing slug variations
 */

/**
 * Generate variations of a slug to try different formats
 * @param slug The original slug
 * @returns An array of slug variations to try
 */
export function getSlugVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [slug];
  
  // Add hyphen version
  const hyphenVersion = slug.replace(/_/g, '-');
  if (!variations.includes(hyphenVersion)) {
    variations.push(hyphenVersion);
  }
  
  // Add underscore version
  const underscoreVersion = slug.replace(/-/g, '_');
  if (!variations.includes(underscoreVersion)) {
    variations.push(underscoreVersion);
  }
  
  // Add without suffix variations
  const withoutSuffix = slug.replace(/-vending$|_vending$/, '');
  if (withoutSuffix !== slug && !variations.includes(withoutSuffix)) {
    variations.push(withoutSuffix);
  }
  
  // Add with suffix variations
  const withSuffix = slug.includes('-vending') || slug.includes('_vending') ? slug : `${slug}-vending`;
  if (withSuffix !== slug && !variations.includes(withSuffix)) {
    variations.push(withSuffix);
  }
  
  return variations;
}

/**
 * Compare two slugs to see if they match, ignoring format differences
 * @param slugA First slug
 * @param slugB Second slug
 * @returns Whether the slugs match
 */
export function slugsMatch(slugA: string, slugB: string): boolean {
  if (!slugA || !slugB) return false;
  
  // Normalize both slugs to lowercase with hyphens
  const normalizedA = slugA.toLowerCase().replace(/_/g, '-');
  const normalizedB = slugB.toLowerCase().replace(/_/g, '-');
  
  // Direct match
  if (normalizedA === normalizedB) return true;
  
  // Check if one has -vending suffix and the other doesn't
  if (normalizedA === `${normalizedB}-vending` || `${normalizedA}-vending` === normalizedB) return true;
  
  return false;
}
