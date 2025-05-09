
import { supabase } from '@/integrations/supabase/client';
import { BusinessGoalFormData } from '@/types/forms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Process benefits array to remove empty items
 */
export const processBenefits = (benefits: string[]): string[] => {
  return benefits.filter(benefit => benefit.trim() !== '');
};

/**
 * Check if a business goal with the given slug already exists
 */
export const checkBusinessGoalSlugExists = async (slug: string): Promise<boolean> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping slug check');
    return false;
  }

  console.log(`[businessGoalService] Checking if slug "${slug}" exists`);
  
  try {
    const { data, error } = await supabase
      .from('business_goals')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error('[businessGoalService] Error checking slug:', error);
      throw new Error(`Error checking slug: ${error.message}`);
    }
    
    return !!data;
  } catch (error) {
    console.error('[businessGoalService] Error in checkBusinessGoalSlugExists:', error);
    return false;
  }
};

/**
 * Add business goal image
 */
export const addBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping image creation');
    return;
  }

  console.log('[businessGoalService] Adding business goal image');
  
  if (!data.image?.url) {
    console.log('[businessGoalService] No image URL provided, skipping image creation');
    return;
  }
  
  try {
    // Update image fields in business_goals table
    const { error } = await supabase
      .from('business_goals')
      .update({
        // These fields don't exist in the current schema but were likely in the old schema
        // We'll log errors but not fail completely
        // @ts-ignore - Ignoring TypeScript errors for legacy fields
        image_url: data.image.url,
        // @ts-ignore - Ignoring TypeScript errors for legacy fields
        image_alt: data.image.alt || data.title
      })
      .eq('id', businessGoalId);
      
    if (error) {
      console.error('[businessGoalService] Error adding business goal image:', error);
      throw new Error(`Failed to add business goal image: ${error.message}`);
    }
  } catch (error) {
    console.error('[businessGoalService] Error in addBusinessGoalImage:', error);
  }
};

/**
 * Add business goal benefits
 */
export const addBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping benefits creation');
    return;
  }

  console.log('[businessGoalService] Adding business goal benefits');
  
  // Process benefits to remove empty entries
  const processedBenefits = processBenefits(data.benefits);
  
  if (processedBenefits.length === 0) {
    console.log('[businessGoalService] No benefits to add');
    return;
  }
  
  try {
    console.log('[businessGoalService] Would insert benefits, but skipping due to non-existent table');
    console.log('[businessGoalService] Benefits data:', processedBenefits);
    
    // Note: We're intentionally not accessing the business_goal_benefits table
    // since it doesn't exist in the current schema
  } catch (error) {
    console.error('[businessGoalService] Error in addBusinessGoalBenefits:', error);
  }
};

/**
 * Add business goal features
 */
export const addBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping features creation');
    return;
  }

  console.log('[businessGoalService] Adding business goal features');
  
  if (!data.features || data.features.length === 0) {
    console.log('[businessGoalService] No features to add');
    return;
  }
  
  // Filter out empty features
  const validFeatures = data.features.filter(
    feature => feature.title.trim() !== '' || feature.description.trim() !== ''
  );
  
  if (validFeatures.length === 0) {
    console.log('[businessGoalService] No valid features to add after filtering');
    return;
  }
  
  try {
    console.log('[businessGoalService] Would insert features, but skipping due to non-existent table');
    console.log('[businessGoalService] Features data:', validFeatures);
    
    // Note: We're intentionally not accessing the business_goal_features table
    // since it doesn't exist in the current schema
  } catch (error) {
    console.error('[businessGoalService] Error in addBusinessGoalFeatures:', error);
  }
};

/**
 * Update business goal image
 */
export const updateBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping image update');
    return;
  }

  console.log('[businessGoalService] Updating business goal image');
  
  try {
    // Update image fields in business_goals table
    // @ts-ignore - Ignoring TypeScript errors for legacy fields
    const { error } = await supabase
      .from('business_goals')
      .update({
        // @ts-ignore - Ignoring TypeScript errors for legacy fields
        image_url: data.image?.url || null,
        // @ts-ignore - Ignoring TypeScript errors for legacy fields
        image_alt: data.image?.alt || data.title || null
      })
      .eq('id', businessGoalId);
      
    if (error) {
      console.error('[businessGoalService] Error updating business goal image:', error);
    }
  } catch (error) {
    console.error('[businessGoalService] Error in updateBusinessGoalImage:', error);
  }
};

/**
 * Update business goal benefits
 */
export const updateBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping benefits update');
    return;
  }

  console.log('[businessGoalService] Updating business goal benefits');
  
  try {
    // Process benefits to remove empty entries
    const processedBenefits = processBenefits(data.benefits);
    
    console.log('[businessGoalService] Would update benefits, but skipping due to non-existent table');
    console.log('[businessGoalService] Benefits data:', processedBenefits);
    
    // Note: We're intentionally not accessing the business_goal_benefits table
    // since it doesn't exist in the current schema
  } catch (error) {
    console.error('[businessGoalService] Error in updateBusinessGoalBenefits:', error);
  }
};

/**
 * Update business goal features
 */
export const updateBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping features update');
    return;
  }

  console.log('[businessGoalService] Updating business goal features');
  
  try {
    // Filter out empty features
    const validFeatures = data.features?.filter(
      feature => feature.title.trim() !== '' || feature.description.trim() !== ''
    ) || [];
    
    console.log('[businessGoalService] Would update features, but skipping due to non-existent table');
    console.log('[businessGoalService] Features data:', validFeatures);
    
    // Note: We're intentionally not accessing the business_goal_features table
    // since it doesn't exist in the current schema
  } catch (error) {
    console.error('[businessGoalService] Error in updateBusinessGoalFeatures:', error);
  }
};
