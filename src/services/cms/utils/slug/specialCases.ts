
/**
 * Special case handlers for specific slugs or slug patterns
 */

/**
 * Get variations specific to special cases
 * @param slug The original slug
 * @returns Array of special case variations
 */
export function getSpecialCaseVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [];
  
  // Special handling for expand-footprint - our most important business goal case
  if (slug === 'expand-footprint' || slug.includes('expand') || slug.includes('footprint')) {
    // Direct variations for expand-footprint
    variations.push('expand-footprint');
    variations.push('expand_footprint');
    variations.push('expandfootprint');
    variations.push('footprint-expand');
    variations.push('expansion-footprint');
    variations.push('expand-retail-footprint');
    variations.push('retail-expansion');
    variations.push('footprint-expansion');
  }
  
  // Special handling for cost reduction
  if (slug.includes('cost') || slug.includes('reduc') || slug.includes('save')) {
    variations.push('reduce-costs');
    variations.push('cost-reduction');
    variations.push('save-money');
    variations.push('cost-efficiency');
  }
  
  // Special handling for revenue growth
  if (slug.includes('revenue') || slug.includes('grow') || slug.includes('sale')) {
    variations.push('increase-revenue');
    variations.push('revenue-growth');
    variations.push('grow-revenue');
    variations.push('boost-sales');
  }
  
  return variations;
}

/**
 * Get variations focused on specific words in the slug
 * @param slug The original slug
 * @returns Array of word-specific variations
 */
export function getWordSpecificVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [];
  const words = slug.split(/[-_]/);
  
  // If the slug has multiple words, try each word individually
  // This helps with matching partial slugs
  if (words.length > 1) {
    for (const word of words) {
      if (word.length > 3) {  // Only use meaningful words (more than 3 chars)
        variations.push(word);
      }
    }
  }
  
  return variations;
}

/**
 * Handle slug matching specific to expand-footprint
 * @param slug The original slug to check
 * @returns boolean indicating if this is an expand-footprint slug
 */
export function isExpandFootprintSlug(slug: string): boolean {
  if (!slug) return false;
  
  // Direct match
  if (slug === 'expand-footprint') return true;
  
  // Pattern-based matching
  const expandFootprintPattern = /expand[-_]?footprint|footprint[-_]?expand|expansion[-_]?footprint/i;
  if (expandFootprintPattern.test(slug)) return true;
  
  // Word matching
  const words = slug.toLowerCase().split(/[-_\s]/);
  if (words.includes('expand') && words.includes('footprint')) return true;
  
  return false;
}

/**
 * Get the canonical version of a special case slug
 * @param slug The original slug
 * @returns The canonical version if it's a special case, or null
 */
export function getSpecialCaseCanonicalSlug(slug: string): string | null {
  if (!slug) return null;
  
  if (isExpandFootprintSlug(slug)) return 'expand-footprint';
  
  // Add other special cases here
  
  return null;
}
