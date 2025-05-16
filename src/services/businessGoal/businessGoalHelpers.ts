
// Import the BusinessGoalItem type from the shared types
import { BusinessGoalItem } from '@/types/businessGoal';
import { Entry } from 'contentful';

/**
 * Helper function to transform Contentful business goal entries into BusinessGoalItem objects
 * 
 * @param entries - Array of Contentful business goal entries
 * @returns Array of BusinessGoalItem objects
 */
export const transformBusinessGoalEntries = (entries: Entry<any>[]): BusinessGoalItem[] => {
  if (!entries || !Array.isArray(entries)) {
    return [];
  }
  
  return entries
    .filter(entry => entry && entry.fields)
    .map(entry => ({
      id: entry.sys?.id || '',
      title: entry.fields.title || '',
      slug: entry.fields.slug || '',
      description: entry.fields.description || '',
      icon: entry.fields.icon || '',
      benefits: Array.isArray(entry.fields.benefits) 
        ? entry.fields.benefits 
        : [],
      image: entry.fields.image?.fields?.file?.url 
        ? `https:${entry.fields.image.fields.file.url}`
        : '',
      imageAlt: entry.fields.image?.fields?.description || entry.fields.title || ''
    }));
};

/**
 * Helper function to transform a single Contentful business goal entry into a BusinessGoalItem
 * 
 * @param entry - A Contentful business goal entry
 * @returns A BusinessGoalItem object or null if the entry is invalid
 */
export const transformBusinessGoalEntry = (entry: Entry<any> | undefined | null): BusinessGoalItem | null => {
  if (!entry || !entry.fields) {
    return null;
  }
  
  return {
    id: entry.sys?.id || '',
    title: entry.fields.title || '',
    slug: entry.fields.slug || '',
    description: entry.fields.description || '',
    icon: entry.fields.icon || '',
    benefits: Array.isArray(entry.fields.benefits) 
      ? entry.fields.benefits 
      : [],
    image: entry.fields.image?.fields?.file?.url 
      ? `https:${entry.fields.image.fields.file.url}`
      : '',
    imageAlt: entry.fields.image?.fields?.description || entry.fields.title || ''
  };
};

// Re-export the type using export type syntax to avoid conflicts
export type { BusinessGoalItem };
