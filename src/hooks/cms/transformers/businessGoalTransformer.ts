
import { isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';
import { safeString, safeArrayField } from '@/services/cms/utils/safeTypeUtilities';
import { CMSBusinessGoal, CMSImage, CMSFeature } from '@/types/cms';
import { Entry, EntrySkeletonType } from 'contentful';

/**
 * Transform a Contentful business goal entry to our app's format
 */
export function transformBusinessGoal(entry: Entry<EntrySkeletonType, undefined, string>): CMSBusinessGoal | null {
  if (!isContentfulEntry(entry)) {
    console.error('[transformBusinessGoal] Invalid entry:', entry);
    return null;
  }
  
  const fields = entry.fields;
  
  // Extract image data if present
  let image: CMSImage | undefined = undefined;
  if (fields.image && isContentfulAsset(fields.image)) {
    image = {
      id: fields.image.sys?.id,
      url: `https:${fields.image.fields?.file?.url || ''}`,
      alt: safeString(fields.image.fields?.title || fields.title || ''),
      width: fields.image.fields?.file?.details?.image?.width,
      height: fields.image.fields?.file?.details?.image?.height
    };
  }
  
  // Extract benefits
  const benefits = safeArrayField(fields, 'benefits')
    .map((benefit: any) => safeString(benefit))
    .filter(Boolean);
  
  // Extract and transform features (these could be links to other entries)
  const features = safeArrayField(fields, 'features')
    .map((feature: any) => {
      if (isContentfulEntry(feature)) {
        const featureFields = feature.fields;
        
        // Create a screenshot object if present
        let screenshot = undefined;
        if (featureFields.screenshot && isContentfulAsset(featureFields.screenshot)) {
          screenshot = {
            id: featureFields.screenshot.sys?.id,
            url: `https:${featureFields.screenshot.fields?.file?.url || ''}`,
            alt: safeString(featureFields.screenshot.fields?.title || featureFields.title || ''),
            width: featureFields.screenshot.fields?.file?.details?.image?.width,
            height: featureFields.screenshot.fields?.file?.details?.image?.height
          };
        }
        
        // Return a properly formatted feature
        return {
          title: safeString(featureFields.title),
          description: safeString(featureFields.description),
          icon: safeString(featureFields.icon),
          screenshot
        } as CMSFeature;
      }
      return null;
    })
    .filter(Boolean) as CMSFeature[];
  
  return {
    id: entry.sys.id,
    title: safeString(fields.title),
    slug: safeString(fields.slug),
    description: safeString(fields.description),
    icon: safeString(fields.icon),
    image,
    benefits,
    features,
    visible: fields.visible !== false, // Default to true
    created_at: entry.sys.createdAt,
    updated_at: entry.sys.updatedAt
  };
}
