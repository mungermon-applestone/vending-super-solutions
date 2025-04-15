
import { createClient } from '@supabase/supabase-js';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature, CMSTechnologyFeatureItem } from '@/types/cms';
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Improved adapter for Technology content type with better error handling
 * and more reliable data processing
 */
export const improvedTechnologyAdapter: TechnologyAdapter = {
  /**
   * Get all technologies from Supabase
   */
  async getAll(options = {}) {
    try {
      console.log('[improvedTechnologyAdapter] Fetching all technologies');
      
      // Query technologies table
      const { data: technologiesData, error: technologiesError } = await supabase
        .from('technologies')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });
      
      if (technologiesError) throw technologiesError;
      
      console.log(`[improvedTechnologyAdapter] Fetched ${technologiesData.length} technologies`);
      
      // If no technologies found, return empty array
      if (!technologiesData || technologiesData.length === 0) {
        return [];
      }
      
      // Get all technology IDs to fetch their sections
      const technologyIds = technologiesData.map(tech => tech.id);
      
      // Fetch all sections for these technologies
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('*, features:technology_features(*)')
        .in('technology_id', technologyIds)
        .order('display_order', { ascending: true });
      
      if (sectionsError) throw sectionsError;
      
      console.log(`[improvedTechnologyAdapter] Fetched ${sectionsData?.length || 0} sections`);
      
      // For each feature, fetch its items
      const featureIds = sectionsData
        ?.flatMap(section => section.features || [])
        .map(feature => feature.id)
        .filter(Boolean) || [];
      
      let featureItems = [];
      
      if (featureIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('technology_feature_items')
          .select('*')
          .in('feature_id', featureIds)
          .order('display_order', { ascending: true });
        
        if (itemsError) throw itemsError;
        
        featureItems = itemsData || [];
        console.log(`[improvedTechnologyAdapter] Fetched ${featureItems.length} feature items`);
      }
      
      // Fetch all images for these technologies and their sections
      const { data: imagesData, error: imagesError } = await supabase
        .from('technology_images')
        .select('*')
        .in('technology_id', technologyIds)
        .order('display_order', { ascending: true });
      
      if (imagesError) throw imagesError;
      
      console.log(`[improvedTechnologyAdapter] Fetched ${imagesData?.length || 0} images`);
      
      // Map feature items to their features
      sectionsData?.forEach(section => {
        if (section.features) {
          section.features.forEach(feature => {
            feature.items = featureItems.filter(item => item.feature_id === feature.id);
          });
        }
      });
      
      // Map sections and images to their technologies
      const technologies: CMSTechnology[] = technologiesData.map(tech => {
        const techSections = sectionsData?.filter(section => section.technology_id === tech.id) || [];
        const techImages = imagesData?.filter(image => image.technology_id === tech.id) || [];
        
        return {
          ...tech,
          sections: techSections,
          image: tech.image_url ? {
            url: tech.image_url,
            alt: tech.image_alt || tech.title
          } : undefined
        };
      });
      
      console.log('[improvedTechnologyAdapter] Returning mapped technologies:', technologies);
      
      return technologies;
    } catch (error) {
      console.error('[improvedTechnologyAdapter.getAll] Error:', error);
      throw handleCMSError(error, 'fetch', 'technologies');
    }
  },
  
  /**
   * Get a technology by slug
   */
  async getBySlug(slug) {
    try {
      console.log(`[improvedTechnologyAdapter] Fetching technology by slug: ${slug}`);
      
      const { data: techData, error: techError } = await supabase
        .from('technologies')
        .select('*')
        .eq('slug', slug)
        .eq('visible', true)
        .single();
      
      if (techError) {
        if (techError.code === 'PGRST116') {
          console.log(`[improvedTechnologyAdapter] Technology with slug "${slug}" not found`);
          return null;
        }
        throw techError;
      }
      
      if (!techData) {
        return null;
      }
      
      // Fetch sections for this technology
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('*, features:technology_features(*)')
        .eq('technology_id', techData.id)
        .order('display_order', { ascending: true });
      
      if (sectionsError) throw sectionsError;
      
      // For each feature, fetch its items
      const featureIds = sectionsData
        ?.flatMap(section => section.features || [])
        .map(feature => feature.id)
        .filter(Boolean) || [];
      
      let featureItems = [];
      
      if (featureIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('technology_feature_items')
          .select('*')
          .in('feature_id', featureIds)
          .order('display_order', { ascending: true });
        
        if (itemsError) throw itemsError;
        
        featureItems = itemsData || [];
      }
      
      // Fetch images for this technology
      const { data: imagesData, error: imagesError } = await supabase
        .from('technology_images')
        .select('*')
        .eq('technology_id', techData.id)
        .order('display_order', { ascending: true });
      
      if (imagesError) throw imagesError;
      
      // Map feature items to their features
      sectionsData?.forEach(section => {
        if (section.features) {
          section.features.forEach(feature => {
            feature.items = featureItems.filter(item => item.feature_id === feature.id);
          });
        }
      });
      
      // Assemble the complete technology object
      const technology: CMSTechnology = {
        ...techData,
        sections: sectionsData || [],
        image: techData.image_url ? {
          url: techData.image_url,
          alt: techData.image_alt || techData.title
        } : undefined
      };
      
      console.log(`[improvedTechnologyAdapter] Returning technology:`, technology);
      
      return technology;
    } catch (error) {
      console.error(`[improvedTechnologyAdapter.getBySlug] Error fetching technology by slug "${slug}":`, error);
      return null;
    }
  },
  
  /**
   * Create a new technology
   */
  async create(data) {
    try {
      console.log('[improvedTechnologyAdapter:create] Creating new technology with data:', data);
      
      // Extract sections for separate insertion
      const { sections, ...techData } = data;
      
      // Create the main technology record first
      const { data: createdTech, error } = await supabase
        .from('technologies')
        .insert(techData)
        .select()
        .single();
        
      if (error) {
        console.error('[improvedTechnologyAdapter:create] Error creating technology:', error);
        throw error;
      }
      
      if (!createdTech) {
        throw new Error('Failed to create technology: no data returned');
      }
      
      // Process sections if provided
      if (sections && sections.length > 0) {
        await this.processSections(createdTech.id, sections);
      }
      
      // Return the complete technology with relations
      return await this.getById(createdTech.id) as CMSTechnology;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:create] Error:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing technology
   */
  async update(id, data) {
    try {
      console.log(`[improvedTechnologyAdapter:update] Updating technology ${id} with data:`, data);
      
      // Extract sections for separate processing
      const { sections, ...techData } = data;
      
      // Update the main technology record first
      const { error } = await supabase
        .from('technologies')
        .update({
          ...techData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('[improvedTechnologyAdapter:update] Error updating technology:', error);
        throw error;
      }
      
      // Process sections if provided
      if (sections) {
        await this.processSections(id, sections);
      }
      
      // Return the complete technology with relations
      return await this.getById(id) as CMSTechnology;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:update] Error:', error);
      throw error;
    }
  },
  
  /**
   * Delete a technology
   */
  async delete(id) {
    try {
      console.log(`[improvedTechnologyAdapter:delete] Deleting technology ${id} and related data`);
      
      // First, get all sections for this technology
      const { data: sections } = await supabase
        .from('technology_sections')
        .select('id')
        .eq('technology_id', id);
        
      if (sections && sections.length > 0) {
        // Get all features for these sections
        const sectionIds = sections.map(s => s.id);
        const { data: features } = await supabase
          .from('technology_features')
          .select('id')
          .in('section_id', sectionIds);
          
        if (features && features.length > 0) {
          // Delete all feature items
          const featureIds = features.map(f => f.id);
          await supabase
            .from('technology_feature_items')
            .delete()
            .in('feature_id', featureIds);
            
          // Delete all features
          await supabase
            .from('technology_features')
            .delete()
            .in('id', featureIds);
        }
        
        // Delete all sections
        await supabase
          .from('technology_sections')
          .delete()
          .in('id', sectionIds);
      }
      
      // Finally delete the technology itself
      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('[improvedTechnologyAdapter:delete] Error deleting technology:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:delete] Error:', error);
      throw error;
    }
  },
  
  /**
   * Get a technology by ID
   */
  async getById(id) {
    try {
      console.log(`[improvedTechnologyAdapter:getById] Fetching technology with ID: ${id}`);
      
      const { data: techData, error: techError } = await supabase
        .from('technologies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (techError) {
        console.error(`[improvedTechnologyAdapter:getById] Error fetching technology: ${techError.message}`);
        return null;
      }
      
      if (!techData) {
        console.log(`[improvedTechnologyAdapter:getById] No technology found with ID: ${id}`);
        return null;
      }
      
      // Fetch sections for this technology
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('technology_sections')
        .select('*, features:technology_features(*)')
        .eq('technology_id', id)
        .order('display_order', { ascending: true });
      
      if (sectionsError) throw sectionsError;
      
      // For each feature, fetch its items
      const featureIds = sectionsData
        ?.flatMap(section => section.features || [])
        .map(feature => feature.id)
        .filter(Boolean) || [];
      
      let featureItems = [];
      
      if (featureIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('technology_feature_items')
          .select('*')
          .in('feature_id', featureIds)
          .order('display_order', { ascending: true });
        
        if (itemsError) throw itemsError;
        
        featureItems = itemsData || [];
      }
      
      // Assemble the complete technology object
      const technology: CMSTechnology = {
        ...techData,
        sections: sectionsData || [],
        image: techData.image_url ? {
          url: techData.image_url, 
          alt: techData.image_alt || techData.title
        } : undefined
      };
      
      // Map feature items to their features
      technology.sections?.forEach(section => {
        if (section.features) {
          section.features.forEach(feature => {
            feature.items = featureItems.filter(item => item.feature_id === feature.id);
          });
        }
      });
      
      return technology;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:getById] Error:', error);
      return null;
    }
  },
  
  /**
   * Clone a technology
   */
  async clone(id) {
    try {
      console.log('[improvedTechnologyAdapter:clone] Cloning technology with id:', id);
      
      // Get the technology to clone
      const techToClone = await this.getById(id);
      
      if (!techToClone) {
        console.error('[improvedTechnologyAdapter:clone] Technology to clone not found');
        return null;
      }
      
      // Create a new technology with similar data but modified title and slug
      const newTechData: TechnologyCreateInput = {
        title: `${techToClone.title} (Copy)`,
        slug: `${techToClone.slug}-copy-${Math.floor(Date.now() / 1000)}`,
        description: techToClone.description,
        image_url: techToClone.image_url,
        image_alt: techToClone.image_alt,
        visible: techToClone.visible
      };
      
      // Clone the technology
      return await this.create(newTechData);
    } catch (error) {
      console.error('[improvedTechnologyAdapter:clone] Error:', error);
      throw error;
    }
  },
  
  /**
   * Helper method to process sections for a technology
   * Used internally by create and update methods
   */
  async processSections(technologyId, sections) {
    // Implementation would be here
    console.log(`[improvedTechnologyAdapter] Processing sections for technology ${technologyId}`);
    // This is a placeholder for future implementation
    return true;
  }
};

