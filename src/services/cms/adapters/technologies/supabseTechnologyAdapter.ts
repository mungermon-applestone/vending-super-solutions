
import { supabase } from '@/integrations/supabase/client';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../../contentTypes/types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';

export const supabseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (options?: QueryOptions): Promise<CMSTechnology[]> => {
    try {
      logCMSOperation('getAll', 'Technology', 'Fetching all technologies');
      
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
        handleCMSError('getAll', 'Technology', error);
        return [];
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
          
          return {
            ...tech,
            sections: sections || []
          };
        })
      );
      
      return technologiesWithSections as CMSTechnology[];
    } catch (error) {
      handleCMSError('getAll', 'Technology', error);
      return [];
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    try {
      logCMSOperation('getBySlug', 'Technology', `Fetching technology with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (error) {
        handleCMSError('getBySlug', 'Technology', error);
        return null;
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
        console.error(`Error fetching sections for technology ${data.id}:`, sectionsError);
        return data as CMSTechnology;
      }
      
      return {
        ...data,
        sections: sections || []
      } as CMSTechnology;
    } catch (error) {
      handleCMSError('getBySlug', 'Technology', error);
      return null;
    }
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    try {
      logCMSOperation('getById', 'Technology', `Fetching technology with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        handleCMSError('getById', 'Technology', error);
        return null;
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
        console.error(`Error fetching sections for technology ${data.id}:`, sectionsError);
        return data as CMSTechnology;
      }
      
      return {
        ...data,
        sections: sections || []
      } as CMSTechnology;
    } catch (error) {
      handleCMSError('getById', 'Technology', error);
      return null;
    }
  },
  
  create: async (technology: TechnologyCreateInput): Promise<CMSTechnology> => {
    try {
      logCMSOperation('create', 'Technology', `Creating new technology: ${technology.title}`);
      
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
        handleCMSError('create', 'Technology', error);
        throw error;
      }
      
      logCMSOperation('create', 'Technology', `Successfully created technology with ID: ${data.id}`);
      
      // Handle sections if provided
      if (technology.sections && technology.sections.length > 0) {
        const sectionsWithTechId = technology.sections.map((section: any, index: number) => ({
          ...section,
          technology_id: data.id,
          display_order: section.display_order || index
        }));
        
        const { error: sectionsError } = await supabase
          .from('technology_sections')
          .insert(sectionsWithTechId);
          
        if (sectionsError) {
          console.error(`Error creating sections for technology ${data.id}:`, sectionsError);
        }
      }
      
      return data as CMSTechnology;
    } catch (error) {
      handleCMSError('create', 'Technology', error);
      throw error;
    }
  },
  
  update: async (id: string, technology: TechnologyUpdateInput): Promise<CMSTechnology> => {
    try {
      logCMSOperation('update', 'Technology', `Updating technology with ID: ${id}`);
      
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
        handleCMSError('update', 'Technology', error);
        throw error;
      }
      
      logCMSOperation('update', 'Technology', `Successfully updated technology with ID: ${id}`);
      
      // Handle sections if provided (this is simplified, would need more logic for update/delete)
      if (technology.sections) {
        // For now, just return the updated technology
        return data as CMSTechnology;
      }
      
      return data as CMSTechnology;
    } catch (error) {
      handleCMSError('update', 'Technology', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      logCMSOperation('delete', 'Technology', `Deleting technology with ID: ${id}`);
      
      // First delete related sections
      const { error: sectionsError } = await supabase
        .from('technology_sections')
        .delete()
        .eq('technology_id', id);
        
      if (sectionsError) {
        console.error(`Error deleting sections for technology ${id}:`, sectionsError);
        // Continue with deletion of the main record
      }
      
      // Then delete the technology
      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id);
        
      if (error) {
        handleCMSError('delete', 'Technology', error);
        return false;
      }
      
      logCMSOperation('delete', 'Technology', `Successfully deleted technology with ID: ${id}`);
      return true;
    } catch (error) {
      handleCMSError('delete', 'Technology', error);
      return false;
    }
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    try {
      logCMSOperation('clone', 'Technology', `Cloning technology with ID: ${id}`);
      
      // Use the generic clone function
      const clonedTechnology = await cloneContentItem<CMSTechnology>(
        'technologies',
        id,
        'Technology'
      );
      
      if (!clonedTechnology) {
        return null;
      }
      
      // Clone related sections
      await cloneRelatedItems(
        'technology_sections',
        'technology_id',
        id,
        clonedTechnology.id
      );
      
      // Return the cloned technology with its sections
      const technologyWithSections = await supabseTechnologyAdapter.getById(clonedTechnology.id);
      
      logCMSOperation('clone', 'Technology', `Successfully cloned technology with ID: ${id} to new ID: ${clonedTechnology.id}`);
      return technologyWithSections;
    } catch (error) {
      handleCMSError('clone', 'Technology', error);
      return null;
    }
  }
};
