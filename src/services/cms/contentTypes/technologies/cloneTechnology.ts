
import { CMSTechnology } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';
import { supabase } from '@/integrations/supabase/client';

/**
 * Clone a technology
 * @param id ID of the technology to clone
 * @returns The cloned technology or null if failed
 */
export async function cloneTechnology(id: string): Promise<CMSTechnology | null> {
  try {
    logCMSOperation('cloneTechnology', 'Technology', `Starting clone operation for technology with ID: ${id}`);
    
    // Clone the main technology entry
    const newTech = await cloneContentItem<CMSTechnology>(
      'technologies',
      id,
      'Technology'
    );
    
    if (!newTech) {
      throw new Error('Failed to clone technology');
    }
    
    // Clone images directly related to technology
    await cloneRelatedItems('technology_images', 'technology_id', id, newTech.id);
    
    // Clone sections
    const { data: originalSections } = await supabase
      .from('technology_sections')
      .select('id')
      .eq('technology_id', id)
      .order('display_order', { ascending: true });
      
    if (originalSections) {
      // Clone each section
      for (const originalSection of originalSections) {
        // Clone the section
        const { data: newSection, error } = await supabase
          .from('technology_sections')
          .select('*')
          .eq('id', originalSection.id)
          .single();
          
        if (error || !newSection) continue;
        
        // Create new section linked to the new technology
        const sectionClone = { ...newSection };
        delete sectionClone.id;
        sectionClone.technology_id = newTech.id;
        
        const { data: insertedSection, error: insertError } = await supabase
          .from('technology_sections')
          .insert(sectionClone)
          .select('id')
          .single();
          
        if (insertError || !insertedSection) continue;
        
        // Clone features for this section
        const { data: originalFeatures } = await supabase
          .from('technology_features')
          .select('*')
          .eq('section_id', originalSection.id);
          
        if (originalFeatures) {
          for (const originalFeature of originalFeatures) {
            // Clone the feature
            const featureClone = { ...originalFeature };
            delete featureClone.id;
            featureClone.section_id = insertedSection.id;
            
            const { data: insertedFeature, error: featureInsertError } = await supabase
              .from('technology_features')
              .insert(featureClone)
              .select('id')
              .single();
              
            if (featureInsertError || !insertedFeature) continue;
            
            // Clone feature items
            await cloneRelatedItems('technology_feature_items', 'feature_id', originalFeature.id, insertedFeature.id);
          }
        }
        
        // Clone images for this section
        await cloneRelatedItems('technology_images', 'section_id', originalSection.id, insertedSection.id);
      }
    }
    
    return newTech;
  } catch (error) {
    handleCMSError('cloneTechnology', 'Technology', error);
    return null;
  }
}
