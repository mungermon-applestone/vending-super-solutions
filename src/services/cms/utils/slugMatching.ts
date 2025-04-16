
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
