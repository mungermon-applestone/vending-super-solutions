
/**
 * Helper function for generating slug variations
 * This ensures we can find content even if slugs have common variations
 */
export function getSlugVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations = [slug];
  
  // Add or remove -vending suffix
  if (slug.endsWith('-vending')) {
    variations.push(slug.replace('-vending', ''));
  } else {
    variations.push(`${slug}-vending`);
  }
  
  // Handle common word separators (dash vs underscore)
  if (slug.includes('-')) {
    variations.push(slug.replace(/-/g, '_'));
  } else if (slug.includes('_')) {
    variations.push(slug.replace(/_/g, '-'));
  }
  
  // Handle common plural/singular variations
  if (slug.endsWith('s')) {
    variations.push(slug.slice(0, -1)); // Remove trailing 's'
  } else {
    variations.push(`${slug}s`); // Add trailing 's'
  }
  
  // Handle common adjective forms with -y and -ies
  if (slug.endsWith('y')) {
    variations.push(`${slug.slice(0, -1)}ies`); // e.g., candy -> candies
  } else if (slug.endsWith('ies')) {
    variations.push(`${slug.slice(0, -3)}y`); // e.g., candies -> candy
  }
  
  // Handle common word permutations (swap order in two-word slugs)
  if (slug.includes('-') && slug.split('-').length === 2) {
    const [first, second] = slug.split('-');
    variations.push(`${second}-${first}`);
  }
  
  // Handle copy suffix pattern (for our upcoming clone feature)
  if (slug.endsWith('-copy')) {
    variations.push(slug.replace(/-copy$/, '')); // Without copy
  } else {
    variations.push(`${slug}-copy`); // With copy
  }
  
  // Handle numbered copy patterns (copy-2, copy-3, etc.)
  const copyNumberMatch = slug.match(/-copy-(\d+)$/);
  if (copyNumberMatch) {
    variations.push(slug.replace(/-copy-\d+$/, '')); // Base without number
    variations.push(slug.replace(/-copy-\d+$/, '-copy')); // Just copy without number
  }
  
  return [...new Set(variations)]; // Remove duplicates
}

/**
 * Compare two slugs for fuzzy matching, accounting for common variations
 * @param targetSlug The slug we are looking for
 * @param candidateSlug The slug to compare against
 * @returns Boolean indicating if slugs match closely enough
 */
export function slugsMatch(targetSlug: string, candidateSlug: string): boolean {
  if (!targetSlug || !candidateSlug) return false;
  
  const targetVariations = getSlugVariations(targetSlug.toLowerCase());
  const candidateNormalized = candidateSlug.toLowerCase();
  
  return targetVariations.includes(candidateNormalized);
}

/**
 * Generates a random suffix for creating unique slug variations
 * @param length Length of the random suffix
 * @returns Random alphanumeric string
 */
export function generateSuffix(length: number = 3): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
