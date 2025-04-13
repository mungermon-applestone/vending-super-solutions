
import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature, CMSTechnologyFeatureItem, CMSTechnologyImage } from '@/types/cms';
import { TechnologyCreateInput, TechnologyUpdateInput } from '../types';

/**
 * Transform Strapi technology data to our internal CMSTechnology format
 */
export function transformStrapiTechnologyToInternal(strapiData: any): CMSTechnology {
  const attributes = strapiData.attributes;
  
  const result: CMSTechnology = {
    id: strapiData.id,
    title: attributes.title,
    slug: attributes.slug,
    description: attributes.description,
    visible: attributes.visible ?? true,
    image_url: attributes.image?.url || attributes.image_url,
    image_alt: attributes.image?.alt || attributes.image_alt,
    created_at: attributes.createdAt || attributes.created_at,
    updated_at: attributes.updatedAt || attributes.updated_at,
    sections: []
  };
  
  // Process sections if they exist
  if (attributes.sections && attributes.sections.data) {
    result.sections = attributes.sections.data.map((sectionData: any) => {
      const sectionAttributes = sectionData.attributes;
      const section: CMSTechnologySection = {
        id: sectionData.id,
        technology_id: strapiData.id,
        section_type: sectionAttributes.section_type,
        title: sectionAttributes.title,
        description: sectionAttributes.description,
        display_order: sectionAttributes.display_order || 0,
        features: [],
        images: []
      };
      
      // Process features if they exist
      if (sectionAttributes.features && sectionAttributes.features.data) {
        section.features = sectionAttributes.features.data.map((featureData: any) => {
          const featureAttributes = featureData.attributes;
          const feature: CMSTechnologyFeature = {
            id: featureData.id,
            section_id: sectionData.id,
            title: featureAttributes.title,
            description: featureAttributes.description,
            icon: featureAttributes.icon,
            display_order: featureAttributes.display_order || 0,
            items: []
          };
          
          // Process feature items if they exist
          if (featureAttributes.items && featureAttributes.items.data) {
            feature.items = featureAttributes.items.data.map((itemData: any) => {
              const itemAttributes = itemData.attributes;
              const item: CMSTechnologyFeatureItem = {
                id: itemData.id,
                feature_id: featureData.id,
                text: itemAttributes.text,
                display_order: itemAttributes.display_order || 0
              };
              return item;
            });
          }
          
          return feature;
        });
      }
      
      // Process images if they exist
      if (sectionAttributes.images && sectionAttributes.images.data) {
        section.images = sectionAttributes.images.data.map((imageData: any) => {
          const imageAttributes = imageData.attributes;
          const image: CMSTechnologyImage = {
            id: imageData.id,
            technology_id: strapiData.id,
            section_id: sectionData.id,
            url: imageAttributes.url,
            alt: imageAttributes.alt,
            width: imageAttributes.width,
            height: imageAttributes.height,
            display_order: imageAttributes.display_order || 0
          };
          return image;
        });
      }
      
      return section;
    });
  }
  
  return result;
}

/**
 * Transform our internal input format to Strapi format for creating/updating technologies
 */
export function transformInputToStrapiFormat(data: TechnologyCreateInput | TechnologyUpdateInput): any {
  // Base technology data
  const strapiData = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    visible: data.visible || true,
    image: data.image ? {
      url: data.image.url,
      alt: data.image.alt
    } : null
  };
  
  // We would need to handle sections and their nested data separately
  // as Strapi often requires creating related entities in separate requests
  
  return strapiData;
}
