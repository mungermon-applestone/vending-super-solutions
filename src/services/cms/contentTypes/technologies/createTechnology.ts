
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';
import { IS_DEVELOPMENT } from '@/config/cms';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTechnologyData {
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: Array<{
    title: string;
    description?: string;
    section_type?: string;
    display_order: number;
    features?: Array<{
      title: string;
      description?: string;
      icon?: string;
      display_order: number;
      items?: Array<{
        text: string;
        display_order: number;
      }>;
    }>;
  }>;
}

/**
 * Creates a new technology entry in the database
 * @param data Technology data to create
 * @returns The created technology object
 */
export const createTechnology = async (data: CreateTechnologyData): Promise<CMSTechnology> => {
  console.log('[createTechnology] Creating new technology:', data.title);
  
  try {
    // Insert the main technology record
    const { data: newTechnology, error: techError } = await supabase
      .from('technologies')
      .insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        image_url: data.image_url,
        image_alt: data.image_alt,
        visible: data.visible || false
      })
      .select()
      .single();
      
    if (techError) {
      console.error('[createTechnology] Error creating technology:', techError);
      throw new Error(`Failed to create technology: ${techError.message}`);
    }
    
    const technologyId = newTechnology.id;
    
    // Process sections if they exist
    if (data.sections && data.sections.length > 0) {
      // Insert all sections for this technology
      for (const section of data.sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('technology_sections')
          .insert({
            technology_id: technologyId,
            title: section.title,
            description: section.description || null,
            section_type: section.section_type || 'feature',
            display_order: section.display_order
          })
          .select()
          .single();
          
        if (sectionError) {
          console.error('[createTechnology] Error creating section:', sectionError);
          throw new Error(`Failed to create section: ${sectionError.message}`);
        }
        
        const sectionId = newSection.id;
        
        // Process features if they exist
        if (section.features && section.features.length > 0) {
          for (const feature of section.features) {
            const { data: newFeature, error: featureError } = await supabase
              .from('technology_features')
              .insert({
                section_id: sectionId,
                title: feature.title,
                description: feature.description || null,
                icon: feature.icon || null,
                display_order: feature.display_order
              })
              .select()
              .single();
              
            if (featureError) {
              console.error('[createTechnology] Error creating feature:', featureError);
              throw new Error(`Failed to create feature: ${featureError.message}`);
            }
            
            const featureId = newFeature.id;
            
            // Process feature items if they exist
            if (feature.items && feature.items.length > 0) {
              const itemsToInsert = feature.items.map(item => ({
                feature_id: featureId,
                text: item.text,
                display_order: item.display_order
              }));
              
              const { error: itemsError } = await supabase
                .from('technology_feature_items')
                .insert(itemsToInsert);
                
              if (itemsError) {
                console.error('[createTechnology] Error creating feature items:', itemsError);
                throw new Error(`Failed to create feature items: ${itemsError.message}`);
              }
            }
          }
        }
      }
    }
    
    // Return the full technology with all related data
    return await fetchTechnologyWithRelations(technologyId);
    
  } catch (error) {
    console.error('[createTechnology] Error:', error);
    throw error;
  }
};

/**
 * Helper function to fetch a technology with all its relations
 */
const fetchTechnologyWithRelations = async (id: string): Promise<CMSTechnology> => {
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
