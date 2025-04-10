
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';
import { IS_DEVELOPMENT } from '@/config/cms';
import { CreateTechnologyData } from './createTechnology';

export interface UpdateTechnologyData extends CreateTechnologyData {
  id: string;
}

/**
 * Updates an existing technology entry in the database
 * @param data Technology data to update
 * @returns The updated technology object
 */
export const updateTechnology = async (
  slug: string, 
  data: Omit<CreateTechnologyData, 'id'>
): Promise<CMSTechnology> => {
  console.log(`[updateTechnology] Updating technology with slug: ${slug}`);
  
  try {
    // First get the existing technology to verify it exists
    const { data: existingTech, error: fetchError } = await supabase
      .from('technologies')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError) {
      console.error('[updateTechnology] Error fetching technology:', fetchError);
      throw new Error(`Technology with slug '${slug}' not found`);
    }
    
    const technologyId = existingTech.id;
    
    // Update the main technology record
    const { error: updateError } = await supabase
      .from('technologies')
      .update({
        title: data.title,
        slug: data.slug,
        description: data.description,
        image_url: data.image_url,
        image_alt: data.image_alt,
        visible: data.visible || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', technologyId);
      
    if (updateError) {
      console.error('[updateTechnology] Error updating technology:', updateError);
      throw new Error(`Failed to update technology: ${updateError.message}`);
    }

    // Handle sections - get existing sections first
    const { data: existingSections } = await supabase
      .from('technology_sections')
      .select('id')
      .eq('technology_id', technologyId);
      
    const existingSectionIds = (existingSections || []).map(section => section.id);
    
    // If there are new sections to process
    if (data.sections && data.sections.length > 0) {
      // Process each section
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        
        // If section has an ID, update it, otherwise create new
        if (section.id) {
          // Update existing section
          await supabase
            .from('technology_sections')
            .update({
              title: section.title,
              description: section.description || null,
              section_type: section.section_type || 'feature',
              display_order: i, // Use index for display order
              updated_at: new Date().toISOString()
            })
            .eq('id', section.id);
            
          // Remove this ID from the list to track deletions
          const index = existingSectionIds.indexOf(section.id);
          if (index > -1) {
            existingSectionIds.splice(index, 1);
          }
        } else {
          // Create new section
          const { data: newSection } = await supabase
            .from('technology_sections')
            .insert({
              technology_id: technologyId,
              title: section.title,
              description: section.description || null,
              section_type: section.section_type || 'feature',
              display_order: i // Use index for display order
            })
            .select()
            .single();
            
          // Update the section object with the new ID for feature processing
          if (newSection) {
            section.id = newSection.id;
          }
        }
        
        // Process features for this section
        await processFeatures(section);
      }
    }
    
    // Delete sections that weren't updated
    if (existingSectionIds.length > 0) {
      await supabase
        .from('technology_sections')
        .delete()
        .in('id', existingSectionIds);
    }
    
    // Return the updated technology with all relations
    return await fetchUpdatedTechnology(technologyId);
  } catch (error) {
    console.error('[updateTechnology] Error:', error);
    throw error;
  }
};

/**
 * Helper function to process section features
 */
async function processFeatures(section: any) {
  if (!section.id || !section.features || section.features.length === 0) {
    return;
  }
  
  // Get existing features
  const { data: existingFeatures } = await supabase
    .from('technology_features')
    .select('id')
    .eq('section_id', section.id);
    
  const existingFeatureIds = (existingFeatures || []).map(feature => feature.id);
  
  // Process each feature
  for (let i = 0; i < section.features.length; i++) {
    const feature = section.features[i];
    
    if (feature.id) {
      // Update existing feature
      await supabase
        .from('technology_features')
        .update({
          title: feature.title,
          description: feature.description || null,
          icon: feature.icon || null,
          display_order: i, // Use index for display order
          updated_at: new Date().toISOString()
        })
        .eq('id', feature.id);
        
      // Remove this ID from the list to track deletions
      const index = existingFeatureIds.indexOf(feature.id);
      if (index > -1) {
        existingFeatureIds.splice(index, 1);
      }
    } else {
      // Create new feature
      const { data: newFeature } = await supabase
        .from('technology_features')
        .insert({
          section_id: section.id,
          title: feature.title,
          description: feature.description || null,
          icon: feature.icon || null,
          display_order: i // Use index for display order
        })
        .select()
        .single();
        
      // Update the feature object with the new ID for item processing
      if (newFeature) {
        feature.id = newFeature.id;
      }
    }
    
    // Process feature items
    await processFeatureItems(feature);
  }
  
  // Delete features that weren't updated
  if (existingFeatureIds.length > 0) {
    await supabase
      .from('technology_features')
      .delete()
      .in('id', existingFeatureIds);
  }
}

/**
 * Helper function to process feature items
 */
async function processFeatureItems(feature: any) {
  if (!feature.id || !feature.items || feature.items.length === 0) {
    return;
  }
  
  // Get existing items
  const { data: existingItems } = await supabase
    .from('technology_feature_items')
    .select('id')
    .eq('feature_id', feature.id);
    
  const existingItemIds = (existingItems || []).map(item => item.id);
  
  // Process each item
  for (let i = 0; i < feature.items.length; i++) {
    const item = feature.items[i];
    
    if (item.id) {
      // Update existing item
      await supabase
        .from('technology_feature_items')
        .update({
          text: item.text,
          display_order: i, // Use index for display order
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);
        
      // Remove this ID from the list to track deletions
      const index = existingItemIds.indexOf(item.id);
      if (index > -1) {
        existingItemIds.splice(index, 1);
      }
    } else {
      // Create new item
      await supabase
        .from('technology_feature_items')
        .insert({
          feature_id: feature.id,
          text: item.text,
          display_order: i // Use index for display order
        });
    }
  }
  
  // Delete items that weren't updated
  if (existingItemIds.length > 0) {
    await supabase
      .from('technology_feature_items')
      .delete()
      .in('id', existingItemIds);
  }
}

/**
 * Helper function to fetch the updated technology with all relations
 */
const fetchUpdatedTechnology = async (id: string): Promise<CMSTechnology> => {
  const { data: technology, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw error;
  }
  
  // Fetch sections
  const { data: sections } = await supabase
    .from('technology_sections')
    .select('*')
    .eq('technology_id', id)
    .order('display_order', { ascending: true });
    
  // For each section, fetch features
  const sectionsWithFeatures = await Promise.all(
    (sections || []).map(async (section) => {
      const { data: features } = await supabase
        .from('technology_features')
        .select('*')
        .eq('section_id', section.id)
        .order('display_order', { ascending: true });
        
      // For each feature, fetch items
      const featuresWithItems = await Promise.all(
        (features || []).map(async (feature) => {
          const { data: items } = await supabase
            .from('technology_feature_items')
            .select('*')
            .eq('feature_id', feature.id)
            .order('display_order', { ascending: true });
            
          return { ...feature, items: items || [] };
        })
      );
      
      return { ...section, features: featuresWithItems || [] };
    })
  );
  
  return { 
    ...technology,
    sections: sectionsWithFeatures
  } as CMSTechnology;
};
