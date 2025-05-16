
import { createClient } from '@/services/contentful/managementClient';
import { 
  checkBusinessGoalSlugExists, 
  addBusinessGoalImage,
  addBusinessGoalBenefits,
  addBusinessGoalFeatures,
  BusinessGoalItem
} from './businessGoalHelpers';

export interface CreateBusinessGoalParams {
  title: string;
  slug: string;
  description: string;
  visible: boolean;
  icon?: string;
  benefits?: BusinessGoalItem[];
  features?: BusinessGoalItem[];
  imageId?: string;
}

export async function createBusinessGoal(params: CreateBusinessGoalParams) {
  try {
    const { title, slug, description, visible, icon, benefits, features, imageId } = params;
    
    // Check if slug exists
    const slugExists = await checkBusinessGoalSlugExists(slug);
    if (slugExists) {
      throw new Error(`A business goal with slug "${slug}" already exists`);
    }
    
    // Create Contentful client
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    // Create entry
    const entry = await environment.createEntry('businessGoal', {
      fields: {
        title: { 'en-US': title },
        slug: { 'en-US': slug },
        description: { 'en-US': description },
        visible: { 'en-US': visible },
        icon: icon ? { 'en-US': icon } : undefined
      }
    });
    
    // Publish entry
    const publishedEntry = await entry.publish();
    
    // Add image if provided
    if (imageId) {
      await addBusinessGoalImage(publishedEntry.sys.id, imageId);
    }
    
    // Add benefits if provided
    if (benefits && benefits.length > 0) {
      await addBusinessGoalBenefits(publishedEntry.sys.id, benefits);
    }
    
    // Add features if provided
    if (features && features.length > 0) {
      await addBusinessGoalFeatures(publishedEntry.sys.id, features);
    }
    
    return publishedEntry;
  } catch (error) {
    console.error('Error creating business goal:', error);
    throw error;
  }
}
