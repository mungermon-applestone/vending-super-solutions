
import { CMSTechnology, CMSTechnologyFeature, CMSTechnologyFeatureItem, CMSTechnologySection } from '@/types/cms';
import { TechnologyCreateInput, TechnologyUpdateInput } from './types';

/**
 * Transform Strapi response data to our internal CMSTechnology format
 */
export function transformStrapiDataToTechnology(strapiData: any): CMSTechnology {
  const attributes = strapiData.attributes || {};
  
  const technology: CMSTechnology = {
    id: strapiData.id,
    slug: attributes.slug || '',
    title: attributes.title || '',
    description: attributes.description || '',
    image_url: attributes.image?.data?.attributes?.url || null,
    image_alt: attributes.image?.data?.attributes?.alternativeText || '',
    visible: attributes.visible ?? true,
    created_at: attributes.createdAt || null,
    updated_at: attributes.updatedAt || null,
    sections: []
  };
  
  // Transform sections if available
  if (attributes.sections && Array.isArray(attributes.sections.data)) {
    technology.sections = attributes.sections.data.map((sectionData: any): CMSTechnologySection => {
      const sectionAttributes = sectionData.attributes || {};
      const section: CMSTechnologySection = {
        id: sectionData.id,
        technology_id: technology.id,
        section_type: sectionAttributes.type || 'generic',
        title: sectionAttributes.title || '',
        description: sectionAttributes.description || '',
        display_order: sectionAttributes.display_order || 0,
        features: []
      };
      
      // Transform features if available
      if (sectionAttributes.features && Array.isArray(sectionAttributes.features.data)) {
        section.features = sectionAttributes.features.data.map((featureData: any): CMSTechnologyFeature => {
          const featureAttributes = featureData.attributes || {};
          const feature: CMSTechnologyFeature = {
            id: featureData.id,
            section_id: section.id,
            title: featureAttributes.title || '',
            description: featureAttributes.description || '',
            icon: featureAttributes.icon || '',
            display_order: featureAttributes.display_order || 0,
            items: []
          };
          
          // Transform feature items if available
          if (featureAttributes.items && Array.isArray(featureAttributes.items.data)) {
            feature.items = featureAttributes.items.data.map((itemData: any): CMSTechnologyFeatureItem => {
              const itemAttributes = itemData.attributes || {};
              return {
                id: itemData.id,
                feature_id: feature.id,
                text: itemAttributes.text || '',
                display_order: itemAttributes.display_order || 0
              };
            });
          }
          
          return feature;
        });
      }
      
      return section;
    });
  }
  
  return technology;
}

/**
 * Transform our internal data format to Strapi format for creating/updating
 */
export function transformInputToStrapiFormat(data: TechnologyCreateInput | TechnologyUpdateInput): any {
  const strapiData: Record<string, any> = {
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      visible: data.visible
    }
  };
  
  // Handle image if provided
  if (data.image) {
    if (data.image.url) {
      // For now, we're just passing the URL directly
      // In a real implementation, we may need to handle file uploads differently
      strapiData.data.image = {
        url: data.image.url,
        alternativeText: data.image.alt || ''
      };
    }
  }
  
  // Handle sections if provided
  if (data.sections && data.sections.length > 0) {
    strapiData.data.sections = data.sections.map(section => ({
      title: section.title,
      description: section.description || '',
      type: section.type,
      display_order: section.display_order || 0,
      features: section.features ? section.features.map(feature => ({
        title: feature.title || '',
        description: feature.description || '',
        icon: feature.icon || '',
        display_order: feature.display_order || 0,
        items: feature.items ? 
          Array.isArray(feature.items) ? 
            feature.items.map(item => 
              typeof item === 'string' ? 
                { text: item } : 
                { text: item.text, display_order: item.display_order || 0 }
            ) : 
            [] : 
          []
      })) : []
    }));
  }
  
  return strapiData;
}
