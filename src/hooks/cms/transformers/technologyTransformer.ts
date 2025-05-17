
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
  
  // Extract image URL if present - using proper type guards
  let imageUrl = '';
  let imageAlt = '';
  
  if (fields.image) {
    // Check if image is an object with fields property (contentful asset)
    if (typeof fields.image === 'object' && fields.image !== null && 'fields' in fields.image) {
      const imageFields = fields.image.fields;
      
      // Check if file exists and has url
      if (imageFields && typeof imageFields === 'object' && imageFields.file && 
          typeof imageFields.file === 'object' && 'url' in imageFields.file && 
          typeof imageFields.file.url === 'string') {
        imageUrl = `https:${imageFields.file.url}`;
      }
      
      // Get title as alt text if available
      if (imageFields && typeof imageFields === 'object' && 'title' in imageFields && 
          typeof imageFields.title === 'string') {
        imageAlt = imageFields.title;
      }
    }
  }

  // Transform sections if present - with proper type checking
  const sections = [];
  if (fields.sections && Array.isArray(fields.sections)) {
    for (const section of fields.sections) {
      // Check if section is a proper Contentful entry with fields
      if (section && typeof section === 'object' && 'fields' in section && 
          section.fields && typeof section.fields === 'object') {
        
        const sectionFields = section.fields;
        const sectionData = {
          id: section.sys && typeof section.sys === 'object' && 'id' in section.sys ? 
              section.sys.id : 
              `section-${Math.random().toString(36).substring(2, 11)}`,
          title: typeof sectionFields.title === 'string' ? sectionFields.title : '',
          description: typeof sectionFields.description === 'string' ? sectionFields.description : '',
          type: typeof sectionFields.type === 'string' ? sectionFields.type : 'default',
          displayOrder: typeof sectionFields.displayOrder === 'number' ? sectionFields.displayOrder : 0,
          features: [],
          images: []
        };
        
        // Transform features if present - with type checking
        if (sectionFields.features && Array.isArray(sectionFields.features)) {
          sectionData.features = sectionFields.features
            .filter(feature => feature && typeof feature === 'object' && 'fields' in feature)
            .map(feature => {
              const featureFields = feature.fields;
              return {
                id: feature.sys && typeof feature.sys === 'object' && 'id' in feature.sys ? 
                    feature.sys.id : 
                    `feature-${Math.random().toString(36).substring(2, 11)}`,
                title: typeof featureFields.title === 'string' ? featureFields.title : '',
                description: typeof featureFields.description === 'string' ? featureFields.description : '',
                icon: typeof featureFields.icon === 'string' ? featureFields.icon : '',
                displayOrder: typeof featureFields.displayOrder === 'number' ? featureFields.displayOrder : 0
              };
            });
        }
        
        sections.push(sectionData);
      }
    }
  }

  // Construct the final object with safe fallbacks for all properties
  return {
    id: entry.sys && typeof entry.sys === 'object' && 'id' in entry.sys ? entry.sys.id : 'unknown-id',
    title: typeof fields.title === 'string' ? fields.title : '',
    slug: typeof fields.slug === 'string' ? fields.slug : '',
    description: typeof fields.description === 'string' ? fields.description : '',
    image: imageUrl,
    imageAlt: imageAlt,
    sections: sections
  };
}
