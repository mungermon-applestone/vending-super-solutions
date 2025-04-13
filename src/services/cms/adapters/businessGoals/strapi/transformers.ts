
import { CMSBusinessGoal, CMSFeature } from '@/types/cms';
import { BusinessGoalCreateInput, BusinessGoalUpdateInput } from '../types';

/**
 * Transform Strapi business goal data to our internal format
 */
export function transformStrapiDataToBusinessGoal(strapiData: any): CMSBusinessGoal {
  const attributes = strapiData.attributes;
  
  const businessGoal: CMSBusinessGoal = {
    id: strapiData.id,
    title: attributes.title,
    slug: attributes.slug,
    description: attributes.description,
    visible: attributes.visible ?? true,
    icon: attributes.icon,
    image: attributes.image?.data ? {
      id: attributes.image.data.id,
      url: attributes.image.data.attributes.url,
      alt: attributes.image.data.attributes.alternativeText || attributes.image.data.attributes.alt || attributes.title,
      width: attributes.image.data.attributes.width,
      height: attributes.image.data.attributes.height
    } : undefined,
    created_at: attributes.createdAt,
    updated_at: attributes.updatedAt,
    features: [],
    benefits: []
  };
  
  // Handle Strapi media field format which might be different
  if (attributes.image_url) {
    businessGoal.image_url = attributes.image_url;
  } else if (businessGoal.image) {
    businessGoal.image_url = businessGoal.image.url;
  }
  
  if (attributes.image_alt) {
    businessGoal.image_alt = attributes.image_alt;
  } else if (businessGoal.image) {
    businessGoal.image_alt = businessGoal.image.alt;
  }
  
  // Process features if they exist
  if (attributes.features && attributes.features.data) {
    businessGoal.features = attributes.features.data.map((featureData: any) => {
      const featureAttributes = featureData.attributes;
      const feature: CMSFeature = {
        id: featureData.id,
        title: featureAttributes.title,
        description: featureAttributes.description,
        icon: featureAttributes.icon,
        display_order: featureAttributes.display_order || 0
      };
      
      // Process screenshot if it exists
      if (featureAttributes.screenshot && featureAttributes.screenshot.data) {
        const screenshotData = featureAttributes.screenshot.data;
        feature.screenshot = {
          id: screenshotData.id,
          url: screenshotData.attributes.url,
          alt: screenshotData.attributes.alternativeText || screenshotData.attributes.alt || `${feature.title} screenshot`,
          width: screenshotData.attributes.width,
          height: screenshotData.attributes.height
        };
      }
      
      return feature;
    });
  }
  
  // Process benefits if they exist
  if (attributes.benefits && attributes.benefits.data) {
    businessGoal.benefits = attributes.benefits.data.map((benefitData: any) => 
      benefitData.attributes.text
    );
  }
  
  return businessGoal;
}

/**
 * Transform our internal input format to Strapi format for creating/updating business goals
 */
export function transformInputToStrapiFormat(data: BusinessGoalCreateInput | BusinessGoalUpdateInput): any {
  // Base business goal data
  const strapiData: Record<string, any> = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    visible: data.visible || true,
    icon: data.icon
  };
  
  // Handle image
  if (data.image) {
    strapiData.image = {
      url: data.image.url,
      alt: data.image.alt
    };
  }
  
  // We would need to handle features and benefits separately
  // as Strapi often requires creating related entities in separate requests
  
  return strapiData;
}
