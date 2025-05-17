
import { Entry } from 'contentful';

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
  
  // Extract image URL if present
  let imageUrl = '';
  let imageAlt = '';
  
  if (fields.image && typeof fields.image === 'object' && fields.image.fields) {
    if (fields.image.fields.file && fields.image.fields.file.url) {
      imageUrl = `https:${fields.image.fields.file.url}`;
    }
    imageAlt = fields.image.fields.title || '';
  }

  // Transform sections if present
  const sections = [];
  if (fields.sections && Array.isArray(fields.sections)) {
    for (const section of fields.sections) {
      if (section && section.fields) {
        const sectionData = {
          id: section.sys?.id || `section-${Math.random().toString(36).substring(2, 11)}`,
          title: section.fields.title || '',
          description: section.fields.description || '',
          type: section.fields.type || 'default',
          displayOrder: section.fields.displayOrder || 0,
          features: [],
          images: []
        };
        
        // Transform features if present
        if (section.fields.features && Array.isArray(section.fields.features)) {
          sectionData.features = section.fields.features
            .filter(feature => feature && feature.fields)
            .map(feature => ({
              id: feature.sys?.id || `feature-${Math.random().toString(36).substring(2, 11)}`,
              title: feature.fields.title || '',
              description: feature.fields.description || '',
              icon: feature.fields.icon || '',
              displayOrder: feature.fields.displayOrder || 0
            }));
        }
        
        sections.push(sectionData);
      }
    }
  }

  return {
    id: entry.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    description: fields.description || '',
    image: imageUrl,
    imageAlt: imageAlt,
    sections: sections
  };
}
