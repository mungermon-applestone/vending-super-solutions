
import { CMSBusinessGoal, CMSFeature, CMSImage } from '@/types/cms';
import { BusinessGoalCreateInput, BusinessGoalUpdateInput } from '../types';

/**
 * Transform Strapi data structure to our internal CMSBusinessGoal format
 * @param data Strapi business goal data
 * @returns CMSBusinessGoal object
 */
export function transformStrapiDataToBusinessGoal(data: any): CMSBusinessGoal {
  const attributes = data.attributes;
  
  // Transform main business goal data
  const businessGoal: CMSBusinessGoal = {
    id: data.id,
    title: attributes.title,
    slug: attributes.slug,
    description: attributes.description,
    visible: attributes.visible ?? true,
    created_at: attributes.createdAt,
    updated_at: attributes.updatedAt,
    icon: attributes.icon || undefined
  };
  
  // Transform image if available
  if (attributes.image && attributes.image.data) {
    const imageData = attributes.image.data;
    const imageAttr = imageData.attributes;
    
    businessGoal.image = {
      id: imageData.id,
      url: imageAttr.url,
      alt: imageAttr.alternativeText || attributes.title,
      width: imageAttr.width,
      height: imageAttr.height
    };
    
    businessGoal.image_url = imageAttr.url;
    businessGoal.image_alt = imageAttr.alternativeText || attributes.title;
  }
  
  // Transform benefits if available
  if (attributes.benefits && attributes.benefits.data) {
    businessGoal.benefits = attributes.benefits.data.map((item: any) => item.attributes.text);
  }
  
  // Transform features if available
  if (attributes.features && attributes.features.data) {
    businessGoal.features = attributes.features.data.map((featureData: any): CMSFeature => {
      const featureAttr = featureData.attributes;
      const feature: CMSFeature = {
        id: featureData.id,
        title: featureAttr.title,
        description: featureAttr.description,
        icon: featureAttr.icon,
        display_order: featureAttr.display_order
      };
      
      // Add screenshot if available
      if (featureAttr.screenshot && featureAttr.screenshot.data) {
        const screenshotData = featureAttr.screenshot.data;
        feature.screenshot = {
          id: screenshotData.id,
          url: screenshotData.attributes.url,
          alt: screenshotData.attributes.alternativeText || featureAttr.title,
          width: screenshotData.attributes.width,
          height: screenshotData.attributes.height
        };
      }
      
      return feature;
    });
  }
  
  return businessGoal;
}

/**
 * Transform our internal data structure to Strapi format for creating/updating
 * @param data BusinessGoalCreateInput or BusinessGoalUpdateInput
 * @returns Strapi formatted data
 */
export function transformInputToStrapiFormat(data: BusinessGoalCreateInput | BusinessGoalUpdateInput): any {
  // Base data transformation
  const strapiData: any = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    visible: data.visible !== undefined ? data.visible : true,
    icon: data.icon || null
  };
  
  // Handle image if provided
  if (data.image) {
    if (typeof data.image === 'string') {
      // If image is provided as ID
      strapiData.image = data.image;
    } else if (data.image.url) {
      // If image is provided as object with URL
      // This would require handling file upload separately
      // For now, we'll just log a warning
      console.warn('[transformInputToStrapiFormat] Image object provided - file upload handling required');
    }
  }
  
  // Handle benefits if provided
  if (data.benefits && data.benefits.length > 0) {
    strapiData.benefits = data.benefits.map(text => ({ text }));
  }
  
  // Handle features if provided
  if (data.features && data.features.length > 0) {
    strapiData.features = data.features.map((feature, index) => {
      const featureData: any = {
        title: feature.title,
        description: feature.description,
        icon: feature.icon || null,
        display_order: index
      };
      
      // Handle screenshot if provided
      if (feature.screenshot) {
        if (typeof feature.screenshot === 'string') {
          featureData.screenshot = feature.screenshot;
        } else if (feature.screenshot.url) {
          // This would require handling file upload separately
          console.warn('[transformInputToStrapiFormat] Screenshot object provided - file upload handling required');
        }
      }
      
      return featureData;
    });
  }
  
  return strapiData;
}
