import { Asset } from 'contentful-management';
import { createClient } from '@/services/contentful/managementClient';

// TypeScript interfaces for benefits and features
export interface BusinessGoalItem {
  id: string;
  text: string;
}

/**
 * Check if a business goal slug already exists
 */
export async function checkBusinessGoalSlugExists(slug: string): Promise<boolean> {
  try {
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    const entries = await environment.getEntries({
      content_type: 'businessGoal',
      'fields.slug': slug,
      limit: 1
    });
    
    return entries.total > 0;
  } catch (error) {
    console.error('Error checking slug existence:', error);
    throw error;
  }
}

/**
 * Add an image to a business goal
 */
export async function addBusinessGoalImage(entryId: string, imageId: string): Promise<void> {
  try {
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    const entry = await environment.getEntry(entryId);
    const asset = await environment.getAsset(imageId);
    
    entry.fields.image = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: asset.sys.id
        }
      }
    };
    
    await entry.update();
    await entry.publish();
  } catch (error) {
    console.error('Error adding image to business goal:', error);
    throw error;
  }
}

/**
 * Add benefits to a business goal
 */
export async function addBusinessGoalBenefits(entryId: string, benefits: BusinessGoalItem[]): Promise<void> {
  try {
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    const entry = await environment.getEntry(entryId);
    
    entry.fields.benefits = {
      'en-US': benefits.map(benefit => benefit.text)
    };
    
    await entry.update();
    await entry.publish();
  } catch (error) {
    console.error('Error adding benefits to business goal:', error);
    throw error;
  }
}

/**
 * Add features to a business goal
 */
export async function addBusinessGoalFeatures(entryId: string, features: BusinessGoalItem[]): Promise<void> {
  try {
    const client = await createClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || 'master');
    
    const entry = await environment.getEntry(entryId);
    
    entry.fields.features = {
      'en-US': features.map(feature => feature.text)
    };
    
    await entry.update();
    await entry.publish();
  } catch (error) {
    console.error('Error adding features to business goal:', error);
    throw error;
  }
}

/**
 * Update image on a business goal
 */
export async function updateBusinessGoalImage(entryId: string, imageId: string): Promise<void> {
  try {
    return addBusinessGoalImage(entryId, imageId);
  } catch (error) {
    console.error('Error updating business goal image:', error);
    throw error;
  }
}

/**
 * Update benefits on a business goal
 */
export async function updateBusinessGoalBenefits(entryId: string, benefits: BusinessGoalItem[]): Promise<void> {
  try {
    return addBusinessGoalBenefits(entryId, benefits);
  } catch (error) {
    console.error('Error updating business goal benefits:', error);
    throw error;
  }
}

/**
 * Update features on a business goal
 */
export async function updateBusinessGoalFeatures(entryId: string, features: BusinessGoalItem[]): Promise<void> {
  try {
    return addBusinessGoalFeatures(entryId, features);
  } catch (error) {
    console.error('Error updating business goal features:', error);
    throw error;
  }
}

export { BusinessGoalItem };
