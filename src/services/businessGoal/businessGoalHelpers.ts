
import { Entry } from 'contentful';
import { CMSBusinessGoal } from '@/types/cms';

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
  
  return entries.map(entry => {
    if (!entry || !entry.fields) {
      console.warn('Invalid entry in transformBusinessGoalEntries:', entry);
      return null;
    }
    
    const fields = entry.fields;
    
    return {
      id: entry.sys?.id || 'unknown-id',
      title: typeof fields.title === 'string' ? fields.title : 'Untitled',
      slug: typeof fields.slug === 'string' ? fields.slug : 'unknown-slug',
      description: typeof fields.description === 'string' ? fields.description : '',
      icon: typeof fields.icon === 'string' ? fields.icon : undefined,
      benefits: Array.isArray(fields.benefits) ? 
        fields.benefits.filter(benefit => typeof benefit === 'string') : 
        undefined,
      image: fields.image?.fields?.file?.url ? 
        `https:${fields.image.fields.file.url}` : 
        undefined,
      imageAlt: fields.image?.fields?.title || undefined
    };
  }).filter(Boolean) as BusinessGoalItem[];
};
