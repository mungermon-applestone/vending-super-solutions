
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
  
  // Special case handling for known problematic slugs
  const specialCases: Record<string, string[]> = {
    'data-analytics': ['data_analytics', 'analytics', 'data-analytics-vending', 'data_analytics_vending'],
    'expand-footprint': ['expand_footprint', 'expansion', 'footprint-expansion', 'expand_footprint_vending', 'market-expansion'],
    'marketing-and-promotions': ['marketing_and_promotions', 'marketing', 'promotions', 'marketing_promotions', 'marketing-promotions']
  };
  
  // Check if we have special variations for this slug
  if (specialCases[slug]) {
    variations.push(...specialCases[slug]);
    console.log(`[getSlugVariations] Using special case variations for "${slug}":`, specialCases[slug]);
  }
  
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
  
  // Handle specific word variations
  if (slug.includes('analytics')) {
    variations.push(slug.replace('analytics', 'analysis'));
  }
  
  if (slug.includes('marketing')) {
    variations.push(slug.replace('marketing', 'promotion'));
    variations.push(slug.replace('marketing-and-promotions', 'marketing'));
    variations.push(slug.replace('marketing-and-promotions', 'promotions'));
  }
  
  if (slug.includes('expand')) {
    variations.push(slug.replace('expand-footprint', 'expansion'));
    variations.push(slug.replace('expand-footprint', 'market-expansion'));
  }
  
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
  
  // Enhanced special case matching for known problematic slugs
  if (normalizedA === 'data-analytics' || normalizedB === 'data-analytics') {
    const dataAnalyticsVariations = ['data-analytics', 'analytics', 'data-analysis', 'analytics-vending'];
    if (dataAnalyticsVariations.includes(normalizedA) && dataAnalyticsVariations.includes(normalizedB)) {
      return true;
    }
  }
  
  if (normalizedA === 'expand-footprint' || normalizedB === 'expand-footprint') {
    const expandFootprintVariations = ['expand-footprint', 'expansion', 'footprint-expansion', 'market-expansion'];
    if (expandFootprintVariations.includes(normalizedA) && expandFootprintVariations.includes(normalizedB)) {
      return true;
    }
  }
  
  if (normalizedA === 'marketing-and-promotions' || normalizedB === 'marketing-and-promotions') {
    const marketingVariations = ['marketing-and-promotions', 'marketing', 'promotions', 'marketing-promotions'];
    if (marketingVariations.includes(normalizedA) && marketingVariations.includes(normalizedB)) {
      return true;
    }
  }
  
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
  
  // Special case handling for specific business goals
  const specialCaseMap: Record<string, string[]> = {
    'data-analytics': ['data-analytics', 'data_analytics', 'analytics', 'data-analysis'],
    'expand-footprint': ['expand-footprint', 'expand_footprint', 'expansion', 'market-expansion'],
    'marketing-and-promotions': ['marketing-and-promotions', 'marketing_and_promotions', 'marketing', 'promotions']
  };
  
  // Check if this is a special case
  for (const [targetSlug, variations] of Object.entries(specialCaseMap)) {
    if (variations.includes(normalizedSearchSlug)) {
      // Find the actual slug that best matches our target
      const matchingSlug = allSlugs.find(slug => {
        const normalizedSlug = slug.toLowerCase().replace(/_/g, '-');
        return normalizedSlug === targetSlug || variations.includes(normalizedSlug);
      });
      
      if (matchingSlug) {
        console.log(`[findBestSlugMatch] Special case match found for "${normalizedSearchSlug}" -> "${matchingSlug}"`);
        return matchingSlug;
      }
    }
  }
  
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

