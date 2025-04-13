import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature, CMSTechnologyImage } from '@/types/cms';
import { TechnologyCreateInput, TechnologyUpdateInput } from '../types';

/**
 * Transform Strapi technology data to our internal format
 * @param strapiData Raw data from Strapi
 * @returns Technology in our internal format
 */
export function transformStrapiTechnologyToInternal(strapiData: any): CMSTechnology {
  const attributes = strapiData.attributes || strapiData;
  const id = strapiData.id;
  
  // Transform sections if they exist
  const sections: CMSTechnologySection[] = [];
  
  if (attributes.sections && Array.isArray(attributes.sections.data)) {
    attributes.sections.data.forEach((sectionData: any) => {
      const sectionAttrs = sectionData.attributes || sectionData;
      
      // Create the base section
      const section: CMSTechnologySection = {
        id: sectionData.id,
        technology_id: id,
        section_type: sectionAttrs.type || sectionAttrs.section_type || 'default',
        title: sectionAttrs.title,
        description: sectionAttrs.description,
        display_order: sectionAttrs.display_order || 0,
        features: [],
        images: []
      };
      
      // Add features if they exist
      if (sectionAttrs.features && Array.isArray(sectionAttrs.features.data)) {
        section.features = sectionAttrs.features.data.map((featureData: any) => {
          const featureAttrs = featureData.attributes || featureData;
          
          const feature: CMSTechnologyFeature = {
            id: featureData.id,
            section_id: section.id,
            title: featureAttrs.title || '',
            description: featureAttrs.description,
            icon: featureAttrs.icon,
            display_order: featureAttrs.display_order || 0,
            items: []
          };
          
          // Add feature items if they exist
          if (featureAttrs.items && Array.isArray(featureAttrs.items.data)) {
            feature.items = featureAttrs.items.data.map((itemData: any) => {
              const itemAttrs = itemData.attributes || itemData;
              return {
                id: itemData.id,
                feature_id: feature.id,
                text: itemAttrs.text || '',
                display_order: itemAttrs.display_order || 0
              };
            });
          }
          
          return feature;
        });
      }
      
      // Add images if they exist
      if (sectionAttrs.images && Array.isArray(sectionAttrs.images.data)) {
        section.images = sectionAttrs.images.data.map((imageData: any) => {
          const imageAttrs = imageData.attributes || imageData;
          
          const image: CMSTechnologyImage = {
            id: imageData.id,
            technology_id: id,
            section_id: section.id,
            url: imageAttrs.url,
            alt: imageAttrs.alt || '',
            width: imageAttrs.width,
            height: imageAttrs.height,
            display_order: imageAttrs.display_order || 0
          };
          
          return image;
        });
      }
      
      sections.push(section);
    });
  }
  
  // Construct the full technology object
  return {
    id: id,
    slug: attributes.slug,
    title: attributes.title,
    description: attributes.description,
    image_url: attributes.image_url || null,
    image_alt: attributes.image_alt || null,
    visible: typeof attributes.visible === 'boolean' ? attributes.visible : true,
    created_at: attributes.createdAt || attributes.created_at,
    updated_at: attributes.updatedAt || attributes.updated_at,
    sections: sections
  };
}

/**
 * Transform our internal data format to Strapi format for create/update operations
 * @param data Input data in our internal format
 * @returns Data formatted for Strapi API
 */
export function transformInputToStrapiFormat(data: TechnologyCreateInput | TechnologyUpdateInput): any {
  // Map our internal format to Strapi's expected format
  const strapiData = {
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url,
      image_alt: data.image_alt,
      visible: data.visible,
      // Other fields would be transformed here
    }
  };
  
  return strapiData;
}
