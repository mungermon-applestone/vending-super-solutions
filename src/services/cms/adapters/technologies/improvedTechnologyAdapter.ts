
import { createClient } from '@supabase/supabase-js';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature, CMSTechnologyFeatureItem } from '@/types/cms';
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

export const improvedTechnologyAdapter: TechnologyAdapter = {
  async getAll(options = {}) {
    try {
      console.log('[improvedTechnologyAdapter] Fetching all technologies');
      
      const { data: technologiesData, error: technologiesError } = await supabase
        .from('technologies')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });
      
      if (technologiesError) throw technologiesError;
      
      console.log(`[improvedTechnologyAdapter] Fetched ${technologiesData.length} technologies`);
      
      if (!technologiesData || technologiesData.length === 0) {
        return [];
      }
      
      const technologies: CMSTechnology[] = technologiesData.map(tech => ({
        id: tech.id,
        title: tech.title,
        slug: tech.slug,
        description: tech.description,
        visible: tech.visible,
        sections: [],
        image: tech.image_url ? {
          url: tech.image_url,
          alt: tech.image_alt || tech.title
        } : undefined
      }));
      
      return technologies;
    } catch (error) {
      console.error('[improvedTechnologyAdapter.getAll] Error:', error);
      throw handleCMSError(error, 'fetch', 'technologies');
    }
  },

  async getBySlug(slug) {
    try {
      console.log(`[improvedTechnologyAdapter] Fetching technology by slug: ${slug}`);
      
      const { data: tech, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('slug', slug)
        .eq('visible', true)
        .single();
      
      if (error || !tech) {
        return null;
      }
      
      const technology: CMSTechnology = {
        id: tech.id,
        title: tech.title,
        slug: tech.slug,
        description: tech.description,
        visible: tech.visible,
        sections: [],
        image: tech.image_url ? {
          url: tech.image_url,
          alt: tech.image_alt || tech.title
        } : undefined
      };
      
      return technology;
    } catch (error) {
      console.error(`[improvedTechnologyAdapter.getBySlug] Error:`, error);
      return null;
    }
  },

  async create(data) {
    try {
      const { data: createdTech, error } = await supabase
        .from('technologies')
        .insert({
          title: data.title,
          slug: data.slug,
          description: data.description,
          visible: data.visible,
          image_url: data.image?.url,
          image_alt: data.image?.alt
        })
        .select()
        .single();
        
      if (error || !createdTech) {
        throw error || new Error('Failed to create technology');
      }
      
      return {
        id: createdTech.id,
        title: createdTech.title,
        slug: createdTech.slug,
        description: createdTech.description,
        visible: createdTech.visible,
        sections: [],
        image: createdTech.image_url ? {
          url: createdTech.image_url,
          alt: createdTech.image_alt || createdTech.title
        } : undefined
      };
    } catch (error) {
      console.error('[improvedTechnologyAdapter:create] Error:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { data: updatedTech, error } = await supabase
        .from('technologies')
        .update({
          title: data.title,
          slug: data.slug,
          description: data.description,
          visible: data.visible,
          image_url: data.image?.url,
          image_alt: data.image?.alt,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error || !updatedTech) {
        throw error || new Error('Failed to update technology');
      }
      
      return {
        id: updatedTech.id,
        title: updatedTech.title,
        slug: updatedTech.slug,
        description: updatedTech.description,
        visible: updatedTech.visible,
        sections: [],
        image: updatedTech.image_url ? {
          url: updatedTech.image_url,
          alt: updatedTech.image_alt || updatedTech.title
        } : undefined
      };
    } catch (error) {
      console.error('[improvedTechnologyAdapter:update] Error:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:delete] Error:', error);
      throw error;
    }
  },

  async clone(id) {
    try {
      const originalTech = await this.getById(id);
      
      if (!originalTech) {
        throw new Error('Technology to clone not found');
      }
      
      const newTech = await this.create({
        title: `${originalTech.title} (Copy)`,
        slug: `${originalTech.slug}-copy-${Math.floor(Date.now() / 1000)}`,
        description: originalTech.description,
        visible: originalTech.visible,
        image: originalTech.image
      });
      
      return newTech;
    } catch (error) {
      console.error('[improvedTechnologyAdapter:clone] Error:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data: tech, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !tech) {
        return null;
      }
      
      return {
        id: tech.id,
        title: tech.title,
        slug: tech.slug,
        description: tech.description,
        visible: tech.visible,
        sections: [],
        image: tech.image_url ? {
          url: tech.image_url,
          alt: tech.image_alt || tech.title
        } : undefined
      };
    } catch (error) {
      console.error('[improvedTechnologyAdapter:getById] Error:', error);
      return null;
    }
  }
};
