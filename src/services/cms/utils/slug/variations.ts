
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
  
  // Handle common category-specific variations
  if (slug.includes('food')) {
    variations.push(slug.replace('food', 'foods'));
  } else if (slug.includes('foods')) {
    variations.push(slug.replace('foods', 'food'));
  }
  
  if (slug.includes('toy')) {
    variations.push(slug.replace('toy', 'toys'));
  } else if (slug.includes('toys')) {
    variations.push(slug.replace('toys', 'toy'));
  }
  
  if (slug.includes('cosmetic')) {
    variations.push(slug.replace('cosmetic', 'cosmetics'));
  } else if (slug.includes('cosmetics')) {
    variations.push(slug.replace('cosmetics', 'cosmetic'));
  }
  
  if (slug.includes('pharma')) {
    variations.push(slug.replace('pharma', 'pharmaceutical'));
  } else if (slug.includes('pharmaceutical')) {
    variations.push(slug.replace('pharmaceutical', 'pharma'));
  }

  // Handle vape and cannabis specific variations
  if (slug.includes('vape')) {
    variations.push(slug.replace('vape', 'cannabis'));
    variations.push(slug.replace('vape', 'marijuana'));
    variations.push(slug.replace('vape', 'vaping'));
  } else if (slug.includes('cannabis')) {
    variations.push(slug.replace('cannabis', 'vape'));
    variations.push(slug.replace('cannabis', 'marijuana'));
  }
  
  // Handle "-and-" vs "&" variations
  if (slug.includes('-and-')) {
    variations.push(slug.replace(/-and-/g, '-&-'));
  } else if (slug.includes('-&-')) {
    variations.push(slug.replace(/-&-/g, '-and-'));
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
  
  // Handle additional compound variations (toys-cards-collectibles)
  if (slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length > 2) {
      // Try with just first part
      variations.push(parts[0]);
      // Try with just last part
      variations.push(parts[parts.length - 1]);
      // Try with first and last parts
      variations.push(`${parts[0]}-${parts[parts.length - 1]}`);
    }
  }

  // Try with and without trailing -s on each variation (for items like "sample" vs "samples")
  const currentVariations = [...variations];
  currentVariations.forEach(variant => {
    if (variant.endsWith('s')) {
      variations.push(variant.slice(0, -1));
    } else {
      variations.push(`${variant}s`);
    }
  });
  
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
