
import { CMSBusinessGoal } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';

/**
 * Clone an existing business goal with a new ID and modified title/slug
 * This is a mock implementation since the CMS-related Supabase tables no longer exist
 * @param id The ID of the business goal to clone
 * @returns The cloned business goal object or null if not found
 */
export const cloneBusinessGoal = async (id: string): Promise<CMSBusinessGoal | null> => {
  console.log(`[cloneBusinessGoal] Mock: Cloning business goal with ID: ${id}`);
  
  try {
    // Create a mock cloned business goal for testing purposes
    const clonedGoal: CMSBusinessGoal = {
      id: uuidv4(),
      title: `Clone of business goal ${id.substring(0, 6)}`,
      slug: `clone-of-business-goal-${Date.now()}`,
      description: 'This is a clone created by the mock cloneBusinessGoal function',
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('[cloneBusinessGoal] Mock: Business goal cloned successfully');
    return clonedGoal;
  } catch (error) {
    console.error('[cloneBusinessGoal] Error:', error);
    return null;
  }
};
