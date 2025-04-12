/**
 * Slug Utilities
 * 
 * A comprehensive collection of utilities for handling URL-friendly slugs throughout the application.
 * This module centralizes slug generation, normalization, matching, and other related functionality
 * that was previously scattered across different files.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a URL-friendly slug from text
 * @param text Input text to convert to slug
 * @returns URL-friendly slug string
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Normalize a slug by converting to lowercase, trimming and handling special cases
 * @param slug The slug to normalize
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Convert to lowercase and trim whitespace
  const normalized = slug.toLowerCase().trim();
  
  // Handle URL-encoded characters if any
  try {
    return decodeURIComponent(normalized);
  } catch (e) {
    // If decoding fails (e.g., not encoded), return the original normalized string
    return normalized;
  }
}

/**
 * Generate variations of a slug to support fuzzy matching
 * @param slug Base slug to generate variations for
 * @returns Array of possible slug variations
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
 * Compare two slugs for exact match (case-insensitive)
 * @param slug1 First slug to compare
 * @param slug2 Second slug to compare
 * @returns Boolean indicating if slugs match exactly
 */
export function exactSlugMatch(slug1: string, slug2: string): boolean {
  const normalizedSlug1 = normalizeSlug(slug1);
  const normalizedSlug2 = normalizeSlug(slug2);
  return normalizedSlug1 === normalizedSlug2;
}

/**
 * Extract and normalize a UUID from a mixed string format
 * @param input String that might contain a UUID
 * @returns Extracted UUID or null if not found
 */
export function extractUUID(input: string): string | null {
  // UUID pattern: 8-4-4-4-12 hexadecimal characters
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = input && input.match(uuidPattern);
  
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  
  return null;
}

/**
 * Create a SEO-friendly URL that includes both slug and UUID
 * @param slug SEO-friendly slug
 * @param uuid Product UUID
 * @returns Combined slug with UUID
 */
export function createSlugWithUUID(slug: string, uuid: string): string {
  const normalizedSlug = normalizeSlug(slug);
  return `${normalizedSlug}--${uuid}`;
}

/**
 * Parse a combined slug-UUID to extract both components
 * @param combinedSlug Combined slug in format "slug--uuid"
 * @returns Object containing separated slug and UUID
 */
export function parseSlugWithUUID(combinedSlug: string): {slug: string, uuid: string | null} {
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
}

/**
 * Generate a random suffix for creating unique slug variations
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

/**
 * Ensure a slug is unique by appending a random suffix if needed
 * @param baseSlug The original slug
 * @param existingSlugs Array of existing slugs to check against
 * @returns A unique slug with suffix if needed
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  const normalizedSlug = normalizeSlug(baseSlug);
  
  // If slug is already unique, return it
  if (!existingSlugs.includes(normalizedSlug)) {
    return normalizedSlug;
  }
  
  // Otherwise, add a random suffix until we get a unique slug
  let uniqueSlug = '';
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const suffix = generateSuffix();
    uniqueSlug = `${normalizedSlug}-${suffix}`;
    
    if (!existingSlugs.includes(uniqueSlug)) {
      return uniqueSlug;
    }
    
    attempts++;
  }
  
  // If we still don't have a unique slug, use timestamp
  return `${normalizedSlug}-${Date.now().toString(36)}`;
}

/**
 * Log details about slug operations for debugging
 * @param operation The operation being performed
 * @param slug The slug being operated on
 * @param details Additional details about the operation
 */
export function logSlugOperation(operation: string, slug: string, details?: any): void {
  console.log(`[SlugUtils:${operation}] ${slug}${details ? ` - ${JSON.stringify(details)}` : ''}`);
}
