
import { CMSBusinessGoal } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';
import { fetchBusinessGoalBySlug } from './fetchBusinessGoals';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Clone a business goal in the CMS
 * @param id The ID of the business goal to clone
 * @returns The cloned business goal data, or null if not successful
 */
export const cloneBusinessGoal = async (id: string): Promise<CMSBusinessGoal | null> => {
  try {
    console.log('[cloneBusinessGoal] Cloning business goal with ID:', id);
    
    // Get the original business goal by ID
    const originalGoal = await fetchBusinessGoalBySlug(id);
    
    if (!originalGoal) {
      console.error('[cloneBusinessGoal] Business goal not found');
      return null;
    }
    
    // Create a mock cloned goal
    const clonedGoal: CMSBusinessGoal = {
      id: uuidv4(),
      title: `${originalGoal.title} (Clone)`,
      slug: `${originalGoal.slug}-clone-${Date.now()}`,
      description: originalGoal.description,
      icon: originalGoal.icon,
      features: originalGoal.features ? originalGoal.features.map(feature => ({
        ...feature,
        id: uuidv4()
      })) : [],
      benefits: originalGoal.benefits ? originalGoal.benefits.map(benefit => ({
        ...benefit,
        id: uuidv4()
      })) : []
    };
    
    console.log('[cloneBusinessGoal] Created cloned business goal:', clonedGoal);
    return clonedGoal;
    
  } catch (error) {
    console.error('[cloneBusinessGoal] Error cloning business goal:', error);
    throw handleCMSError(error, 'clone', 'BusinessGoal');
  }
};
