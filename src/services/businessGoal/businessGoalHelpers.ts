
import { supabase } from '@/integrations/supabase/client';
import { BusinessGoalFormData } from '@/types/forms';

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
  console.log(`[businessGoalService] Checking if slug "${slug}" exists`);
  
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
};

/**
 * Add business goal image
 */
export const addBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  console.log('[businessGoalService] Adding business goal image');
  
  if (!data.image?.url) {
    console.log('[businessGoalService] No image URL provided, skipping image creation');
    return;
  }
  
  // Update image fields in business_goals table
  const { error } = await supabase
    .from('business_goals')
    .update({
      image_url: data.image.url,
      image_alt: data.image.alt || data.title
    })
    .eq('id', businessGoalId);
    
  if (error) {
    console.error('[businessGoalService] Error adding business goal image:', error);
    throw new Error(`Failed to add business goal image: ${error.message}`);
  }
};

/**
 * Add business goal benefits
 */
export const addBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  console.log('[businessGoalService] Adding business goal benefits');
  
  // Process benefits to remove empty entries
  const processedBenefits = processBenefits(data.benefits);
  
  if (processedBenefits.length === 0) {
    console.log('[businessGoalService] No benefits to add');
    return;
  }
  
  // Create entries for each benefit
  const benefitsToInsert = processedBenefits.map((benefit, index) => ({
    business_goal_id: businessGoalId,
    benefit,
    display_order: index
  }));

  // Insert the benefits into the database
  const { error } = await supabase
    .from('business_goal_benefits')
    .insert(benefitsToInsert);
    
  if (error) {
    console.error('[businessGoalService] Error adding business goal benefits:', error);
    throw new Error(`Failed to add business goal benefits: ${error.message}`);
  }
};

/**
 * Add business goal features
 */
export const addBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
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
  
  // Insert each feature
  for (let i = 0; i < validFeatures.length; i++) {
    const feature = validFeatures[i];
    
    // Insert the feature
    const { data: newFeature, error: featureError } = await supabase
      .from('business_goal_features')
      .insert({
        business_goal_id: businessGoalId,
        title: feature.title,
        description: feature.description,
        icon: feature.icon || 'check',
        display_order: i
      })
      .select('id')
      .single();
      
    if (featureError || !newFeature) {
      console.error('[businessGoalService] Error adding business goal feature:', featureError);
      throw new Error(`Failed to add business goal feature: ${featureError?.message || 'Unknown error'}`);
    }
    
    // Add screenshot image if provided
    if (feature.screenshotUrl) {
      const { error: imageError } = await supabase
        .from('business_goal_feature_images')
        .insert({
          feature_id: newFeature.id,
          url: feature.screenshotUrl,
          alt: feature.screenshotAlt || feature.title
        });
        
      if (imageError) {
        console.error('[businessGoalService] Error adding feature image:', imageError);
        throw new Error(`Failed to add feature image: ${imageError.message}`);
      }
    }
  }
};

/**
 * Update business goal image
 */
export const updateBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  console.log('[businessGoalService] Updating business goal image');
  
  // Update image fields in business_goals table
  const { error } = await supabase
    .from('business_goals')
    .update({
      image_url: data.image?.url || null,
      image_alt: data.image?.alt || data.title || null
    })
    .eq('id', businessGoalId);
    
  if (error) {
    console.error('[businessGoalService] Error updating business goal image:', error);
    throw new Error(`Failed to update business goal image: ${error.message}`);
  }
};

/**
 * Update business goal benefits
 */
export const updateBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  console.log('[businessGoalService] Updating business goal benefits');
  
  // Process benefits to remove empty entries
  const processedBenefits = processBenefits(data.benefits);
  
  // First delete all existing benefits for this business goal
  const { error: deleteError } = await supabase
    .from('business_goal_benefits')
    .delete()
    .eq('business_goal_id', businessGoalId);
    
  if (deleteError) {
    console.error('[businessGoalService] Error deleting existing benefits:', deleteError);
    throw new Error(`Failed to update benefits: ${deleteError.message}`);
  }
  
  // If there are no new benefits, we're done
  if (processedBenefits.length === 0) {
    console.log('[businessGoalService] No new benefits to add');
    return;
  }
  
  // Insert the new benefits
  const benefitsToInsert = processedBenefits.map((benefit, index) => ({
    business_goal_id: businessGoalId,
    benefit,
    display_order: index
  }));
  
  const { error: insertError } = await supabase
    .from('business_goal_benefits')
    .insert(benefitsToInsert);
    
  if (insertError) {
    console.error('[businessGoalService] Error inserting new benefits:', insertError);
    throw new Error(`Failed to add new benefits: ${insertError.message}`);
  }
};

/**
 * Update business goal features
 */
export const updateBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  console.log('[businessGoalService] Updating business goal features');
  
  // First get all existing features to keep track of which ones need to be deleted
  const { data: existingFeatures, error: fetchError } = await supabase
    .from('business_goal_features')
    .select('id')
    .eq('business_goal_id', businessGoalId);
    
  if (fetchError) {
    console.error('[businessGoalService] Error fetching existing features:', fetchError);
    throw new Error(`Failed to update features: ${fetchError.message}`);
  }
  
  // Delete all existing features and their images
  for (const feature of existingFeatures || []) {
    // Delete feature images first (foreign key constraint)
    const { error: imageDeleteError } = await supabase
      .from('business_goal_feature_images')
      .delete()
      .eq('feature_id', feature.id);
      
    if (imageDeleteError) {
      console.error('[businessGoalService] Error deleting feature images:', imageDeleteError);
      throw new Error(`Failed to delete feature images: ${imageDeleteError.message}`);
    }
  }
  
  // Delete all features
  const { error: featureDeleteError } = await supabase
    .from('business_goal_features')
    .delete()
    .eq('business_goal_id', businessGoalId);
    
  if (featureDeleteError) {
    console.error('[businessGoalService] Error deleting existing features:', featureDeleteError);
    throw new Error(`Failed to delete existing features: ${featureDeleteError.message}`);
  }
  
  // If there are no new features, we're done
  if (!data.features || data.features.length === 0) {
    console.log('[businessGoalService] No new features to add');
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
  
  // Insert each new feature
  await addBusinessGoalFeatures(
    { ...data, features: validFeatures }, 
    businessGoalId
  );
};
