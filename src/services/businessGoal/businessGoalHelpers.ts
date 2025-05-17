
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
    
    // Extract image URL if available
    let imageUrl: string | undefined;
    let imageAlt: string | undefined;
    
    if (fields.image && typeof fields.image === 'object' && fields.image.fields) {
      const imageFields = fields.image.fields;
      if (imageFields.file && typeof imageFields.file === 'object' && typeof imageFields.file.url === 'string') {
        imageUrl = `https:${imageFields.file.url}`;
      }
      imageAlt = typeof imageFields.title === 'string' ? imageFields.title : undefined;
    }
    
    // Extract benefits array if available
    let benefits: string[] | undefined;
    if (Array.isArray(fields.benefits)) {
      benefits = fields.benefits
        .filter(benefit => typeof benefit === 'string')
        .map(benefit => benefit as string);
    }
    
    return {
      id: entry.sys?.id || 'unknown-id',
      title: typeof fields.title === 'string' ? fields.title : 'Untitled',
      slug: typeof fields.slug === 'string' ? fields.slug : 'unknown-slug',
      description: typeof fields.description === 'string' ? fields.description : '',
      icon: typeof fields.icon === 'string' ? fields.icon : undefined,
      benefits: benefits,
      image: imageUrl,
      imageAlt: imageAlt
    };
  }).filter(Boolean) as BusinessGoalItem[];
};
