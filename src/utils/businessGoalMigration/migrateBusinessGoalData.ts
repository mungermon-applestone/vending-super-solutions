import { supabaseClient } from '@/services/supabase/supabaseClient';
import { createContentfulClient } from '@/services/cms/utils/contentfulClient';
import { ContentTypeProps } from '@/services/cms/types/contentfulTypes';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';

/**
 * Check if business goal data exists in Contentful
 */
export async function checkIfBusinessGoalDataExists(): Promise<boolean> {
  try {
    const client = createContentfulClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
    });
    
    // Check if business goals exist in Contentful
    const entries = await client.getEntries({
      content_type: 'businessGoal',
      limit: 1
    });
    
    return entries.items.length > 0;
  } catch (error) {
    console.error('Error checking business goal data:', error);
    return false;
  }
}

/**
 * Migrate business goals from Supabase to Contentful
 */
export async function migrateBusinessGoalData(): Promise<{ success: boolean; message: string }> {
  try {
    // Check if data already exists in Contentful
    const dataExists = await checkIfBusinessGoalDataExists();
    if (dataExists) {
      return { 
        success: true, 
        message: 'Business goal data already exists in Contentful' 
      };
    }
    
    // Fetch business goals from Supabase
    const { data: businessGoals, error } = await supabaseClient
      .from('business_goals')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    if (!businessGoals || businessGoals.length === 0) {
      return { 
        success: false, 
        message: 'No business goals found in Supabase'
      };
    }
    
    // TODO: Handle the actual migration of data
    // This would typically involve:
    // 1. Creating content types in Contentful if they don't exist
    // 2. Uploading each business goal as a new entry
    // 3. Handling related assets (images, etc.)
    
    toast.success(`Found ${businessGoals.length} business goals to migrate`);
    
    return {
      success: true,
      message: `Found ${businessGoals.length} business goals ready for migration`
    };
  } catch (error) {
    console.error('Error migrating business goals:', error);
    return {
      success: false,
      message: `Migration failed: ${(error as Error).message}`
    };
  }
}
