
import { supabase } from '@/integrations/supabase/client';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { handleCMSError } from '../../utils/errorHandling';

/**
 * Implementation of the Technology Adapter for Supabase
 */
export const supabaseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (options?: QueryOptions): Promise<CMSTechnology[]> => {
    try {
      console.log('[supabaseTechnologyAdapter] Fetching all technologies');
      
      let query = supabase.from('technologies').select('*');
      
      // Apply filters if provided
      if (options?.filters) {
        if (options.filters.visible !== undefined) {
          query = query.eq('visible', options.filters.visible);
        }
        
        if (options.filters.search) {
          query = query.or(`title.ilike.%${options.filters.search}%,description.ilike.%${options.filters.search}%`);
        }
      }
      
      // Apply ordering
      if (options?.orderBy) {
        const direction = options.orderDirection || 'asc';
        query = query.order(options.orderBy, { ascending: direction === 'asc' });
      } else {
        // Default ordering by title
        query = query.order('title', { ascending: true });
      }
      
      // Apply pagination if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw handleCMSError(error, 'getAll', 'Technology');
      }
      
      // Get sections for each technology
      const technologiesWithSections = await Promise.all(
        data.map(async (tech) => {
          const { data: sections, error: sectionsError } = await supabase
            .from('technology_sections')
            .select('*')
            .eq('technology_id', tech.id)
            .order('display_order', { ascending: true });
            
          if (sectionsError) {
            console.error(`Error fetching sections for technology ${tech.id}:`, sectionsError);
            return tech;
          }
          
          // For each section, get its features
          const sectionsWithFeatures = await Promise.all(
            (sections || []).map(async (section) => {
              const { data: features, error: featuresError } = await supabase
                .from('technology_features')
                .select('*')
                .eq('section_id', section.id)
                .order('display_order', { ascending: true });
                
              if (featuresError) {
                console.error(`Error fetching features for section ${section.id}:`, featuresError);
                return section;
              }
              
              return {
                ...section,
                features: features || []
              };
            })
          );
          
          return {
            ...tech,
            sections: sectionsWithFeatures || []
          };
        })
      );
      
      return technologiesWithSections as CMSTechnology[];
    } catch (error) {
      throw handleCMSError(error, 'getAll', 'Technology');
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Fetching technology with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (error) {
        throw handleCMSError(error, 'getBySlug', 'Technology', slug);
      }
      
      if (!data) {
        return null;
      }
      
      // Get sections for the technology
      const { data: sections, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('*')
        .eq('technology_id', data.id)
        .order('display_order', { ascending: true });
        
      if (sectionsError) {
        throw handleCMSError(sectionsError, 'getBySlug (sections)', 'Technology', slug);
      }
      
      // For each section, get its features
      const sectionsWithFeatures = await Promise.all(
        (sections || []).map(async (section) => {
          const { data: features, error: featuresError } = await supabase
            .from('technology_features')
            .select('*')
            .eq('section_id', section.id)
            .order('display_order', { ascending: true });
            
          if (featuresError) {
            console.error(`Error fetching features for section ${section.id}:`, featuresError);
            return section;
          }
          
          return {
            ...section,
            features: features || []
          };
        })
      );
      
      return {
        ...data,
        sections: sectionsWithFeatures || []
      } as CMSTechnology;
    } catch (error) {
      throw handleCMSError(error, 'getBySlug', 'Technology', slug);
    }
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Fetching technology with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        throw handleCMSError(error, 'getById', 'Technology', id);
      }
      
      if (!data) {
        return null;
      }
      
      // Get sections for the technology
      const { data: sections, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('*')
        .eq('technology_id', data.id)
        .order('display_order', { ascending: true });
        
      if (sectionsError) {
        throw handleCMSError(sectionsError, 'getById (sections)', 'Technology', id);
      }
      
      // For each section, get its features
      const sectionsWithFeatures = await Promise.all(
        (sections || []).map(async (section) => {
          const { data: features, error: featuresError } = await supabase
            .from('technology_features')
            .select('*')
            .eq('section_id', section.id)
            .order('display_order', { ascending: true });
            
          if (featuresError) {
            console.error(`Error fetching features for section ${section.id}:`, featuresError);
            return section;
          }
          
          return {
            ...section,
            features: features || []
          };
        })
      );
      
      return {
        ...data,
        sections: sectionsWithFeatures || []
      } as CMSTechnology;
    } catch (error) {
      throw handleCMSError(error, 'getById', 'Technology', id);
    }
  },
  
  create: async (technology: TechnologyCreateInput): Promise<CMSTechnology> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Creating new technology: ${technology.title}`);
      
      const { data, error } = await supabase
        .from('technologies')
        .insert({
          title: technology.title,
          slug: technology.slug,
          description: technology.description,
          image_url: technology.image_url,
          image_alt: technology.image_alt,
          visible: technology.visible ?? true
        })
        .select()
        .single();
        
      if (error) {
        throw handleCMSError(error, 'create', 'Technology');
      }
      
      // Handle sections if provided
      if (technology.sections && technology.sections.length > 0) {
        for (let i = 0; i < technology.sections.length; i++) {
          const section = technology.sections[i];
          
          // Create section
          const { data: sectionData, error: sectionError } = await supabase
            .from('technology_sections')
            .insert({
              technology_id: data.id,
              title: section.title,
              description: section.description,
              section_type: section.type || 'default',
              display_order: section.display_order || i
            })
            .select()
            .single();
            
          if (sectionError) {
            throw handleCMSError(sectionError, 'create (section)', 'Technology', data.id);
          }
          
          // Handle features if provided
          if (section.features && section.features.length > 0) {
            for (let j = 0; j < section.features.length; j++) {
              const feature = section.features[j];
              
              // Create feature
              const { data: featureData, error: featureError } = await supabase
                .from('technology_features')
                .insert({
                  section_id: sectionData.id,
                  title: feature.title,
                  description: feature.description,
                  icon: feature.icon,
                  display_order: feature.display_order || j
                })
                .select()
                .single();
                
              if (featureError) {
                throw handleCMSError(featureError, 'create (feature)', 'Technology', data.id);
              }
              
              // Handle feature items if provided
              if (feature.items && feature.items.length > 0) {
                const featureItems = feature.items.map((item, k) => ({
                  feature_id: featureData.id,  // Use featureData.id instead of feature.id
                  text: item,
                  display_order: k
                }));
                
                const { error: itemsError } = await supabase
                  .from('technology_feature_items')
                  .insert(featureItems);
                  
                if (itemsError) {
                  throw handleCMSError(itemsError, 'create (feature items)', 'Technology', data.id);
                }
              }
            }
          }
        }
      }
      
      // Return the newly created technology with all its relations
      return await supabaseTechnologyAdapter.getById(data.id) as CMSTechnology;
    } catch (error) {
      throw handleCMSError(error, 'create', 'Technology');
    }
  },
  
  update: async (id: string, technology: TechnologyUpdateInput): Promise<CMSTechnology> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Updating technology with ID: ${id}`);
      
      // Update the technology
      const { data, error } = await supabase
        .from('technologies')
        .update({
          title: technology.title,
          slug: technology.slug,
          description: technology.description,
          image_url: technology.image_url,
          image_alt: technology.image_alt,
          visible: technology.visible
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw handleCMSError(error, 'update', 'Technology', id);
      }
      
      // Update sections if provided (simplified version)
      // In a real implementation, we would need to handle updating, deleting, and creating sections
      
      // Return the updated technology with all its relations
      return await supabaseTechnologyAdapter.getById(id) as CMSTechnology;
    } catch (error) {
      throw handleCMSError(error, 'update', 'Technology', id);
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Deleting technology with ID: ${id}`);
      
      // First, get all sections for this technology
      const { data: sections, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('id')
        .eq('technology_id', id);
        
      if (sectionsError) {
        throw handleCMSError(sectionsError, 'delete (fetch sections)', 'Technology', id);
      }
      
      // Delete related data in reverse order (to respect foreign key constraints)
      if (sections && sections.length > 0) {
        const sectionIds = sections.map(section => section.id);
        
        // First, we need to get all feature IDs for these sections
        const { data: features, error: featuresQueryError } = await supabase
          .from('technology_features')
          .select('id')
          .in('section_id', sectionIds);
          
        if (featuresQueryError) {
          throw handleCMSError(featuresQueryError, 'delete (fetch features)', 'Technology', id);
        }
        
        // Now use the feature IDs array to delete feature items
        if (features && features.length > 0) {
          const featureIds = features.map(feature => feature.id);
          
          const { error: featureItemsError } = await supabase
            .from('technology_feature_items')
            .delete()
            .in('feature_id', featureIds);
            
          if (featureItemsError) {
            throw handleCMSError(featureItemsError, 'delete (feature items)', 'Technology', id);
          }
        }
        
        // Delete features
        const { error: featuresError } = await supabase
          .from('technology_features')
          .delete()
          .in('section_id', sectionIds);
          
        if (featuresError) {
          throw handleCMSError(featuresError, 'delete (features)', 'Technology', id);
        }
        
        // Delete sections
        const { error: deleteSectionsError } = await supabase
          .from('technology_sections')
          .delete()
          .eq('technology_id', id);
          
        if (deleteSectionsError) {
          throw handleCMSError(deleteSectionsError, 'delete (sections)', 'Technology', id);
        }
      }
      
      // Finally delete the technology
      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw handleCMSError(error, 'delete', 'Technology', id);
      }
      
      return true;
    } catch (error) {
      throw handleCMSError(error, 'delete', 'Technology', id);
    }
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    try {
      console.log(`[supabaseTechnologyAdapter] Cloning technology with ID: ${id}`);
      
      // First get the technology to clone
      const sourceTechnology = await supabaseTechnologyAdapter.getById(id);
      
      if (!sourceTechnology) {
        throw new Error(`Technology with ID "${id}" not found`);
      }
      
      // Create a new slug with "-copy" suffix
      const newSlug = `${sourceTechnology.slug}-copy`;
      
      // Create a copy with modified title and slug
      const { data: clonedTech, error } = await supabase
        .from('technologies')
        .insert({
          title: `${sourceTechnology.title} (Copy)`,
          slug: newSlug,
          description: sourceTechnology.description,
          image_url: sourceTechnology.image_url,
          image_alt: sourceTechnology.image_alt,
          visible: sourceTechnology.visible
        })
        .select()
        .single();
        
      if (error) {
        throw handleCMSError(error, 'clone', 'Technology', id);
      }
      
      // Clone sections and their features
      if (sourceTechnology.sections && sourceTechnology.sections.length > 0) {
        for (const section of sourceTechnology.sections) {
          // Create cloned section
          const { data: clonedSection, error: sectionError } = await supabase
            .from('technology_sections')
            .insert({
              technology_id: clonedTech.id,
              title: section.title,
              description: section.description,
              section_type: section.section_type,
              display_order: section.display_order
            })
            .select()
            .single();
            
          if (sectionError) {
            throw handleCMSError(sectionError, 'clone (section)', 'Technology', id);
          }
          
          // Clone features
          if (section.features && section.features.length > 0) {
            for (const feature of section.features) {
              // Create cloned feature
              const { data: clonedFeature, error: featureError } = await supabase
                .from('technology_features')
                .insert({
                  section_id: clonedSection.id,
                  title: feature.title,
                  description: feature.description,
                  icon: feature.icon,
                  display_order: feature.display_order
                })
                .select()
                .single();
                
              if (featureError) {
                throw handleCMSError(featureError, 'clone (feature)', 'Technology', id);
              }
              
              // Clone feature items
              if (feature.items && feature.items.length > 0) {
                const featureItems = feature.items.map((item, index) => ({
                  feature_id: clonedFeature.id,
                  text: item.text,
                  display_order: item.display_order || index
                }));
                
                const { error: itemsError } = await supabase
                  .from('technology_feature_items')
                  .insert(featureItems);
                  
                if (itemsError) {
                  throw handleCMSError(itemsError, 'clone (feature items)', 'Technology', id);
                }
              }
            }
          }
        }
      }
      
      // Return the cloned technology with all its relations
      return await supabaseTechnologyAdapter.getById(clonedTech.id);
    } catch (error) {
      throw handleCMSError(error, 'clone', 'Technology', id);
    }
  }
};
