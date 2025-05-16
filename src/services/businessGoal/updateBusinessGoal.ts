
import { createClient } from '@/services/contentful/managementClient';
import {
  updateBusinessGoalImage,
  updateBusinessGoalBenefits,
  updateBusinessGoalFeatures,
  BusinessGoalItem
} from './businessGoalHelpers';

export interface UpdateBusinessGoalParams {
  id: string;
  title?: string;
  description?: string;
  visible?: boolean;
  icon?: string;
  benefits?: BusinessGoalItem[];
  features?: BusinessGoalItem[];
  imageId?: string;
}

export async function updateBusinessGoal(params: UpdateBusinessGoalParams) {
  try {
    const { id, title, description, visible, icon, benefits, features, imageId } = params;
    
    // Create Contentful client
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    // Get entry
    const entry = await environment.getEntry(id);
    
    // Update fields if provided
    if (title !== undefined) {
      entry.fields.title = { 'en-US': title };
    }
    
    if (description !== undefined) {
      entry.fields.description = { 'en-US': description };
    }
    
    if (visible !== undefined) {
      entry.fields.visible = { 'en-US': visible };
    }
    
    if (icon !== undefined) {
      entry.fields.icon = { 'en-US': icon };
    }
    
    // Update entry
    const updatedEntry = await entry.update();
    
    // Publish entry
    const publishedEntry = await updatedEntry.publish();
    
    // Update image if provided
    if (imageId) {
      await updateBusinessGoalImage(publishedEntry.sys.id, imageId);
    }
    
    // Update benefits if provided
    if (benefits) {
      await updateBusinessGoalBenefits(publishedEntry.sys.id, benefits);
    }
    
    // Update features if provided
    if (features) {
      await updateBusinessGoalFeatures(publishedEntry.sys.id, features);
    }
    
    return publishedEntry;
  } catch (error) {
    console.error('Error updating business goal:', error);
    throw error;
  }
}
