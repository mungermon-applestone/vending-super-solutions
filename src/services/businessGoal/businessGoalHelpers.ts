
import { Entry } from 'contentful';
import { CMSBusinessGoal } from '@/types/cms';
import { 
  getStringField,
  getArrayField,
  getEntryId,
  getAssetUrl,
  getAssetAlt
} from '@/utils/contentful/dataExtractors';
import { isObject } from '@/utils/contentful/typeGuards';

export interface BusinessGoalItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  benefits?: string[];
  image?: string;
  imageAlt?: string;
}

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
    .map(entry => {
      if (!entry || !entry.sys || !entry.fields) {
        console.warn('Invalid entry in transformBusinessGoalEntries:', entry);
        return null;
      }
      
      // Extract image information using our helper functions
      const image = entry.fields.image;
      const imageUrl = image ? getAssetUrl(image) : undefined;
      const imageAlt = image ? getAssetAlt(image) : undefined;
      
      // Extract benefits array if available
      const benefits = getArrayField<string>(entry, 'benefits').filter(isString);
      
      return {
        id: getEntryId(entry, 'unknown-id'),
        title: getStringField(entry, 'title', 'Untitled'),
        slug: getStringField(entry, 'slug', 'unknown-slug'),
        description: getStringField(entry, 'description', ''),
        icon: getStringField(entry, 'icon'),
        benefits,
        image: imageUrl,
        imageAlt
      };
    })
    .filter(Boolean) as BusinessGoalItem[];
};
