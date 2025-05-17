
import { Entry } from 'contentful';
import { 
  isContentfulEntry, 
  isObject, 
  isString,
  isNumber,
  isArray
} from '@/utils/contentful/typeGuards';
import {
  getStringField,
  getNumberField,
  getArrayField,
  getEntryId,
  getAssetUrl,
  getAssetAlt
} from '@/utils/contentful/dataExtractors';

/**
 * Transform a Contentful technology entry to our application's format
 * 
 * @param entry - The Contentful entry to transform
 * @returns Transformed technology object
 */
export function transformTechnologyEntry(entry: Entry<any>): any {
  if (!entry || !entry.fields) {
    console.warn('Invalid technology entry:', entry);
    return null;
  }

  const fields = entry.fields;
  
  // Extract image information using our helper functions
  let imageUrl = '';
  let imageAlt = '';
  
  if (fields.image) {
    imageUrl = getAssetUrl(fields.image);
    imageAlt = getAssetAlt(fields.image);
  }

  // Transform sections with proper type checking
  const sections = [];
  if (isArray(fields.sections)) {
    for (const section of fields.sections) {
      if (!isObject(section)) continue;
      
      const sectionData = {
        id: getEntryId(section, `section-${Math.random().toString(36).substring(2, 11)}`),
        title: getStringField(section, 'title', ''),
        description: getStringField(section, 'description', ''),
        type: getStringField(section, 'type', 'default'),
        displayOrder: getNumberField(section, 'displayOrder', 0),
        features: [],
        images: []
      };
      
      // Transform features with type checking
      const sectionFeatures = getArrayField(section, 'features', []);
      if (sectionFeatures.length > 0) {
        sectionData.features = sectionFeatures
          .filter(feature => isObject(feature))
          .map(feature => ({
            id: getEntryId(feature, `feature-${Math.random().toString(36).substring(2, 11)}`),
            title: getStringField(feature, 'title', ''),
            description: getStringField(feature, 'description', ''),
            icon: getStringField(feature, 'icon', ''),
            displayOrder: getNumberField(feature, 'displayOrder', 0)
          }));
      }
      
      sections.push(sectionData);
    }
  }

  // Construct the final object with safe fallbacks for all properties
  return {
    id: getEntryId(entry),
    title: getStringField(entry, 'title', ''),
    slug: getStringField(entry, 'slug', ''),
    description: getStringField(entry, 'description', ''),
    image: imageUrl,
    imageAlt: imageAlt,
    sections: sections
  };
}
