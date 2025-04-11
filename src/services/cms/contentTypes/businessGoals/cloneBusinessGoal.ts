
import { CMSBusinessGoal } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';
import { supabase } from '@/integrations/supabase/client';

/**
 * Clone a business goal
 * @param id ID of the business goal to clone
 * @returns The cloned business goal or null if failed
 */
export async function cloneBusinessGoal(id: string): Promise<CMSBusinessGoal | null> {
  try {
    logCMSOperation('cloneBusinessGoal', 'Business Goal', `Starting clone operation for goal with ID: ${id}`);
    
    // Clone the main business goal
    const newGoal = await cloneContentItem<CMSBusinessGoal>(
      'business_goals',
      id,
      'Business Goal'
    );
    
    if (!newGoal) {
      throw new Error('Failed to clone business goal');
    }
    
    // Clone related items
    await Promise.all([
      // Clone benefits
      cloneRelatedItems('business_goal_benefits', 'business_goal_id', id, newGoal.id),
      
      // Clone features
      cloneRelatedItems('business_goal_features', 'business_goal_id', id, newGoal.id)
    ]);
    
    // For feature images, we need a two-step process
    // First, get all the feature IDs
    const { data: features } = await supabase
      .from('business_goal_features')
      .select('id')
      .eq('business_goal_id', newGoal.id);
      
    if (features && features.length > 0) {
      // For each new feature, check if there were images in the original
      const originalFeatures = await supabase
        .from('business_goal_features')
        .select('id')
        .eq('business_goal_id', id);
        
      if (originalFeatures.data) {
        // Clone feature images for each feature
        for (let i = 0; i < Math.min(features.length, originalFeatures.data.length); i++) {
          await cloneRelatedItems(
            'business_goal_feature_images',
            'feature_id',
            originalFeatures.data[i].id,
            features[i].id
          );
        }
      }
    }
    
    return newGoal;
  } catch (error) {
    handleCMSError('cloneBusinessGoal', 'Business Goal', error);
    return null;
  }
}
