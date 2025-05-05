
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
  
  // Special handling for expand-footprint
  if (slug.includes('expand') || slug.includes('footprint')) {
    variations.push('expand-footprint');
    variations.push('expand_footprint');
    variations.push('expandfootprint');
    variations.push('footprint-expand');
    variations.push('expansion-footprint');
    variations.push('expand-retail-footprint');
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
