
import { supabase } from '@/integrations/supabase/client';
import { businessGoalsData } from './businessGoalData';

/**
 * Checks if business goal data already exists in the database
 * @returns Promise resolving to boolean indicating if data exists
 */
export async function checkIfBusinessGoalDataExists(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('business_goals')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('[checkIfBusinessGoalDataExists] Error checking data:', error);
      throw error;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('[checkIfBusinessGoalDataExists] Unexpected error:', error);
    return false;
  }
}

/**
 * Migrates business goal data from the static data to Supabase
 */
export async function migrateBusinessGoalData(): Promise<boolean> {
  console.log('[migrateBusinessGoalData] Starting business goal data migration...');
  
  try {
    for (const businessGoal of businessGoalsData) {
      console.log(`[migrateBusinessGoalData] Processing business goal: ${businessGoal.title}`);
      
      // Check if business goal with this slug already exists
      const { data: existingGoal, error: checkError } = await supabase
        .from('business_goals')
        .select('id')
        .eq('slug', businessGoal.slug)
        .maybeSingle();
        
      if (checkError) {
        console.error(`[migrateBusinessGoalData] Error checking for existing business goal ${businessGoal.slug}:`, checkError);
        throw checkError;
      }
      
      if (existingGoal) {
        console.log(`[migrateBusinessGoalData] Business goal with slug ${businessGoal.slug} already exists, skipping.`);
        continue;
      }
      
      // Extract the icon name from the JSX element
      let iconName = null;
      if (businessGoal.icon && typeof businessGoal.icon === 'object') {
        // Try to extract the icon name from the className property
        const iconElement = businessGoal.icon as any;
        if (iconElement.type && iconElement.type.name) {
          iconName = iconElement.type.name;
        }
      }
      
      // Create the business goal
      const { data: newGoal, error: goalError } = await supabase
        .from('business_goals')
        .insert({
          title: businessGoal.title,
          slug: businessGoal.slug,
          description: businessGoal.description,
          icon: iconName,
          image_url: businessGoal.heroImage,
          image_alt: `${businessGoal.title} hero image`,
          visible: true
        })
        .select('id')
        .single();
        
      if (goalError) {
        console.error(`[migrateBusinessGoalData] Error creating business goal ${businessGoal.title}:`, goalError);
        throw goalError;
      }
      
      if (!newGoal) {
        throw new Error(`Failed to create business goal ${businessGoal.title}`);
      }
      
      console.log(`[migrateBusinessGoalData] Created business goal: ${businessGoal.title} with ID: ${newGoal.id}`);
      
      // Add features - MOCK IMPLEMENTATION
      if (businessGoal.features && businessGoal.features.length > 0) {
        const featuresData = businessGoal.features.map((feature, index) => {
          // Extract icon name from feature's JSX icon element
          let featureIconName = null;
          if (feature.icon && typeof feature.icon === 'object') {
            const iconElement = feature.icon as any;
            if (iconElement.type && iconElement.type.name) {
              featureIconName = iconElement.type.name;
            }
          }
          
          return {
            business_goal_id: newGoal.id,
            title: feature.title,
            description: feature.description,
            icon: featureIconName,
            display_order: index
          };
        });
        
        // Mock implementation for business_goal_features
        console.log(`[migrateBusinessGoalData] MOCK: Would insert ${featuresData.length} features for business goal ${businessGoal.title}`);
        console.log('[migrateBusinessGoalData] MOCK: Feature data sample:', featuresData[0]);
        
        console.log(`[migrateBusinessGoalData] MOCK: Added ${featuresData.length} features for ${businessGoal.title}`);
      }
    }
    
    console.log('[migrateBusinessGoalData] Business goal data migration completed successfully');
    return true;
  } catch (error) {
    console.error('[migrateBusinessGoalData] Error during business goal data migration:', error);
    return false;
  }
}
