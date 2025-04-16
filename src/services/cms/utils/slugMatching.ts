// Quick and simple slug normalization
export const normalizeSlug = (slug: string): string => {
  if (!slug) return '';
  
  // First decode any URL encoded characters
  let normalizedSlug = decodeURIComponent(slug);
  
  // Convert to lowercase
  normalizedSlug = normalizedSlug.toLowerCase();
  
  // Replace spaces and underscores with hyphens
  normalizedSlug = normalizedSlug.replace(/[\s_]+/g, '-');
  
  // Remove leading and trailing hyphens
  normalizedSlug = normalizedSlug.replace(/^-+|-+$/g, '');
  
  // Remove any invalid characters (allow only letters, numbers, and hyphens)
  normalizedSlug = normalizedSlug.replace(/[^a-z0-9-]/g, '');
  
  console.log(`[normalizeSlug] Original: "${slug}" → Normalized: "${normalizedSlug}"`);
  
  return normalizedSlug;
};

// Function to get common variations of a slug
export const getSlugVariations = (slug: string): string[] => {
  if (!slug) return [];
  
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = normalizeSlug(slug);
  
  const variations = [
    slug,
    decodedSlug,
    normalizedSlug
  ];
  
  // Handle common suffix variations
  if (slug.endsWith('-vending')) {
    variations.push(slug.replace(/-vending$/, ''));
  } else {
    variations.push(`${slug}-vending`);
  }
  
  // Handle common prefix variations
  if (slug.startsWith('vending-')) {
    variations.push(slug.replace(/^vending-/, ''));
  } else {
    variations.push(`vending-${slug}`);
  }
  
  // Handle plural/singular variations
  if (slug.endsWith('s')) {
    variations.push(slug.slice(0, -1));
  } else {
    variations.push(`${slug}s`);
  }
  
  return [...new Set(variations)]; // Remove duplicates
};

// Compare two slugs for fuzzy matching
export const slugsMatch = (targetSlug: string, candidateSlug: string): boolean => {
  if (!targetSlug || !candidateSlug) return false;
  
  const targetVariations = getSlugVariations(targetSlug.toLowerCase());
  const candidateNormalized = candidateSlug.toLowerCase();
  
  return targetVariations.includes(candidateNormalized);
};

// Extract UUID from a string
export const extractUUID = (input: string): string | null => {
  // UUID pattern: 8-4-4-4-12 hexadecimal characters
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = input && input.match(uuidPattern);
  
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  
  return null;
};

// Parse a combined slug-UUID
export const parseSlugWithUUID = (combinedSlug: string): {slug: string, uuid: string | null} => {
  if (!combinedSlug) {
    return { slug: '', uuid: null };
  }
  
  // Try to extract UUID from combined format
  const parts = combinedSlug.split('--');
  
  if (parts.length >= 2) {
    const uuid = extractUUID(parts[parts.length - 1]);
    // Join all parts except the last one (which is the UUID)
    const slug = parts.slice(0, parts.length - 1).join('--');
    return { slug: normalizeSlug(slug), uuid };
  }
  
  // Check if the whole string is a UUID
  const uuid = extractUUID(combinedSlug);
  if (uuid) {
    return { slug: '', uuid };
  }
  
  // Otherwise just return the normalized slug
  return { slug: normalizeSlug(combinedSlug), uuid: null };
};

// Register a slug change mapping
export const registerSlugChange = (urlSlug: string, dbSlug: string): void => {
  console.log(`[slugMapping] Registering mapping: URL '${urlSlug}' -> DB '${dbSlug}'`);
  // Implementation can be expanded as needed
};

// Maps from URL-friendly slugs to database slugs
const urlToDbSlugMap: Record<string, string> = {};

// Maps from database slugs to URL-friendly slugs
const dbToUrlSlugMap: Record<string, string> = {};

/**
 * Maps a URL-friendly slug to a database slug
 */
export const mapUrlSlugToDatabaseSlug = (urlSlug: string): string => {
  const normalizedSlug = normalizeSlug(urlSlug);
  
  // If we have an exact mapping, use it
  if (urlToDbSlugMap[normalizedSlug]) {
    return urlToDbSlugMap[normalizedSlug];
  }
  
  // Try variations
  const variations = getSlugVariations(normalizedSlug);
  for (const variation of variations) {
    if (urlToDbSlugMap[variation]) {
      // Add this mapping for future use
      registerSlugChange(normalizedSlug, urlToDbSlugMap[variation]);
      return urlToDbSlugMap[variation];
    }
  }
  
  // No mapping found, return the original (normalized)
  return normalizedSlug;
};

/**
 * Maps a database slug to a URL-friendly slug
 */
export const mapDatabaseSlugToUrlSlug = (dbSlug: string): string => {
  const normalizedSlug = normalizeSlug(dbSlug);
  
  // If we have an exact mapping, use it
  if (dbToUrlSlugMap[normalizedSlug]) {
    return dbToUrlSlugMap[normalizedSlug];
  }
  
  // Try variations
  const variations = getSlugVariations(normalizedSlug);
  for (const variation of variations) {
    if (dbToUrlSlugMap[variation]) {
      // Add this mapping for future use
      registerSlugChange(dbToUrlSlugMap[variation], normalizedSlug);
      return dbToUrlSlugMap[variation];
    }
  }
  
  // No mapping found, return the original (normalized)
  return normalizedSlug;
};

// Logging functions for slug operations
export const logSlugSearch = (slug: string, searchType: string): void => {
  console.log(`[fetchFromCMS] ${searchType} for slug: "${slug}"`);
};

export const logSlugResult = (slug: string, result: any, matchType: string): void => {
  if (result && result.length > 0) {
    console.log(`[fetchFromCMS] ${matchType} match found for "${slug}": "${result[0].title || 'untitled'}"`);
  } else {
    console.log(`[fetchFromCMS] No ${matchType} match found for "${slug}"`);
  }
};
