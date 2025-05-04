
/**
 * Special case handling for slug variations
 */
import { BUSINESS_GOAL_SLUG_MAP, COMMON_PREFIXES, normalizeSlug } from './common';

/**
 * Handle special cases for known content types
 * @param slug The original slug
 * @returns An array of variations for special cases
 */
export function getSpecialCaseVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [];
  const normalizedSlug = normalizeSlug(slug);
  
  // Critical special case for marketing promotions
  if (normalizedSlug === 'marketing-and-promotions') {
    console.log('[getSpecialCaseVariations] Adding marketing-promotions variation');
    variations.push('marketing-promotions');
    variations.push('marketing'); 
    variations.push('promotions');
  } else if (normalizedSlug === 'marketing-promotions') {
    console.log('[getSpecialCaseVariations] Adding marketing-and-promotions variation');
    variations.push('marketing-and-promotions');
    variations.push('marketing');
    variations.push('promotions');
  }
  
  // Check if we have special variations for this slug
  for (const [targetSlug, specialVariations] of Object.entries(BUSINESS_GOAL_SLUG_MAP)) {
    // If this is a target slug or one of its variations, add all related variations
    if (targetSlug === normalizedSlug || specialVariations.includes(normalizedSlug)) {
      // Add the canonical form
      variations.push(targetSlug);
      // Add all its variations
      variations.push(...specialVariations);
      console.log(`[getSpecialCaseVariations] Using special case variations for "${slug}":`, specialVariations);
      break;
    }
  }
  
  // Add common suffix/prefix variations
  const withoutSuffix = normalizedSlug.replace(/-vending$|_vending$/, '');
  if (withoutSuffix !== normalizedSlug && !variations.includes(withoutSuffix)) {
    variations.push(withoutSuffix);
  }
  
  // Add with suffix variations
  const withSuffix = normalizedSlug.includes('-vending') || normalizedSlug.includes('_vending') 
    ? normalizedSlug 
    : `${normalizedSlug}-vending`;
  
  if (withSuffix !== normalizedSlug && !variations.includes(withSuffix)) {
    variations.push(withSuffix);
  }
  
  // Add common industry-specific prefixes
  for (const prefix of COMMON_PREFIXES) {
    const withPrefix = `${prefix}-${normalizedSlug}`;
    if (!variations.includes(withPrefix)) {
      variations.push(withPrefix);
    }
  }
  
  return variations;
}

/**
 * Handle word-specific variations (singular/plural, word swaps)
 * @param slug The original slug
 * @returns Array of word-specific variations
 */
export function getWordSpecificVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations: string[] = [];
  const normalizedSlug = normalizeSlug(slug);
  
  // Critical special case handling for marketing and promotions
  if (normalizedSlug.includes('marketing')) {
    // Handle both forms as possible variations
    if (normalizedSlug === 'marketing-and-promotions') {
      variations.push('marketing-promotions');
      variations.push('marketing');
      variations.push('promotions');
    } 
    else if (normalizedSlug === 'marketing-promotions') {
      variations.push('marketing-and-promotions');
      variations.push('marketing');
      variations.push('promotions');
    }
    else {
      variations.push(normalizedSlug.replace('marketing', 'promotion'));
      if (normalizedSlug.includes('marketing-and-promotions')) {
        variations.push(normalizedSlug.replace('marketing-and-promotions', 'marketing'));
        variations.push(normalizedSlug.replace('marketing-and-promotions', 'promotions'));
      }
    }
  }
  
  // Handle specific word variations
  if (normalizedSlug.includes('analytics')) {
    variations.push(normalizedSlug.replace('analytics', 'analysis'));
  }
  
  if (normalizedSlug.includes('expand')) {
    variations.push(normalizedSlug.replace('expand-footprint', 'expansion'));
    variations.push(normalizedSlug.replace('expand-footprint', 'market-expansion'));
  }
  
  // Handle plural/singular variations
  if (normalizedSlug.endsWith('s')) {
    variations.push(normalizedSlug.slice(0, -1)); // Singular
  } else {
    variations.push(`${normalizedSlug}s`); // Plural
  }
  
  return variations;
}
