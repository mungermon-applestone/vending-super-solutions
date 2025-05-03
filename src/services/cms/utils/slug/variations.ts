
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
  
  // Add common industry-specific prefixes/suffixes
  ['retail', 'micro', 'smart'].forEach(prefix => {
    const withPrefix = `${prefix}-${slug}`;
    if (!variations.includes(withPrefix)) {
      variations.push(withPrefix);
    }
  });
  
  // Handle plural/singular variations
  if (slug.endsWith('s')) {
    const singular = slug.slice(0, -1);
    if (!variations.includes(singular)) {
      variations.push(singular);
    }
  } else {
    const plural = `${slug}s`;
    if (!variations.includes(plural)) {
      variations.push(plural);
    }
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
  
  // Check for plural/singular variations
  if (normalizedA + 's' === normalizedB || normalizedA === normalizedB + 's') return true;
  
  // Check for common prefixes
  const prefixes = ['retail-', 'micro-', 'smart-'];
  for (const prefix of prefixes) {
    if (normalizedA === prefix + normalizedB || normalizedB === prefix + normalizedA) return true;
  }
  
  return false;
}

/**
 * Advanced fuzzy slug matching that handles more variations
 * @param searchSlug The slug to search for
 * @param allSlugs Array of all available slugs to match against
 * @returns The best matching slug, or null if no match found
 */
export function findBestSlugMatch(searchSlug: string, allSlugs: string[]): string | null {
  if (!searchSlug || !allSlugs || allSlugs.length === 0) return null;
  
  // Normalize the search slug
  const normalizedSearchSlug = searchSlug.toLowerCase().replace(/_/g, '-');
  
  // First try direct match
  const directMatch = allSlugs.find(slug => slug.toLowerCase() === normalizedSearchSlug);
  if (directMatch) return directMatch;
  
  // Then try variations
  const variations = getSlugVariations(normalizedSearchSlug);
  
  for (const variation of variations) {
    const matchingSlug = allSlugs.find(slug => 
      slugsMatch(variation, slug)
    );
    if (matchingSlug) return matchingSlug;
  }
  
  // Try partial matching as last resort (if slug contains the search term)
  const partialMatch = allSlugs.find(slug => 
    slug.toLowerCase().includes(normalizedSearchSlug) || 
    normalizedSearchSlug.includes(slug.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  return null;
}
