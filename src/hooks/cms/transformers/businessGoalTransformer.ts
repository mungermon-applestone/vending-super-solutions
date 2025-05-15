
import { ContentfulBusinessGoal } from '@/types/contentful';
import { CMSBusinessGoal, CMSFeature, CMSImage } from '@/types/cms';

/**
 * Transform a Contentful business goal to our app's format
 */
export function transformBusinessGoalFromContentful(contentfulGoal: ContentfulBusinessGoal): CMSBusinessGoal {
  // Extract image data safely
  let image: CMSImage | undefined = undefined;
  if (contentfulGoal.fields.image) {
    const imageData = contentfulGoal.fields.image;
    image = {
      id: imageData.sys.id,
      url: `https:${imageData.fields.file.url}`,
      alt: imageData.fields.title || contentfulGoal.fields.title,
      width: imageData.fields.file.details?.image?.width,
      height: imageData.fields.file.details?.image?.height
    };
  }
  
  // Transform features safely
  const features: CMSFeature[] = [];
  if (contentfulGoal.fields.features && Array.isArray(contentfulGoal.fields.features)) {
    contentfulGoal.fields.features.forEach(feature => {
      if (feature && feature.fields) {
        const featureItem: CMSFeature = {
          title: feature.fields.title || '',
          description: feature.fields.description || '',
          icon: feature.fields.icon
        };
        
        // Add screenshot if available
        if (feature.fields.screenshot) {
          featureItem.screenshot = {
            url: `https:${feature.fields.screenshot.fields.file.url}`,
            alt: feature.fields.screenshot.fields.title || feature.fields.title || '',
            width: feature.fields.screenshot.fields.file.details?.image?.width,
            height: feature.fields.screenshot.fields.file.details?.image?.height
          };
        }
        
        features.push(featureItem);
      }
    });
  }
  
  // Handle benefits array safely
  const benefits: string[] = [];
  if (contentfulGoal.fields.benefits && Array.isArray(contentfulGoal.fields.benefits)) {
    contentfulGoal.fields.benefits.forEach(benefit => {
      if (typeof benefit === 'string') {
        benefits.push(benefit);
      }
    });
  }
  
  return {
    id: contentfulGoal.sys.id,
    title: contentfulGoal.fields.title,
    slug: contentfulGoal.fields.slug,
    description: contentfulGoal.fields.description,
    icon: contentfulGoal.fields.icon,
    image,
    benefits,
    features,
    visible: contentfulGoal.fields.visible !== false,
    createdAt: contentfulGoal.sys.createdAt || new Date().toISOString(),
    updatedAt: contentfulGoal.sys.updatedAt || new Date().toISOString()
  };
}
