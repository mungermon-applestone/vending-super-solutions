
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { BaseCmsAdapter, createBaseCmsAdapter } from '../baseCmsAdapter';
import { ContentProviderConfig } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extended technology adapter that handles relationships between
 * technologies, sections, features, and items
 */
export class ImprovedTechnologyAdapter extends BaseCmsAdapter<CMSTechnology, TechnologyCreateInput, TechnologyUpdateInput> implements TechnologyAdapter {
  constructor(config: ContentProviderConfig) {
    super('technologies', config);
  }
  
  /**
   * Override getAll to include section relationships
   */
  async getAll(options?: QueryOptions): Promise<CMSTechnology[]> {
    try {
      console.log(`[technologies:getAll] Fetching technologies with options:`, options);
      
      // Get all technologies first
      const technologies = await super.getAll(options);
      
      // Enhance with sections and other related data
      const enhancedTechnologies = await Promise.all(
        technologies.map(async (tech) => this.enhanceTechnologyWithRelations(tech))
      );
      
      return enhancedTechnologies;
    } catch (error) {
      console.error(`[technologies:getAll] Error:`, error);
      throw error;
    }
  }
  
  /**
   * Override getBySlug to include section relationships
   */
  async getBySlug(slug: string): Promise<CMSTechnology | null> {
    try {
      const technology = await super.getBySlug(slug);
      
      if (!technology) {
        return null;
      }
      
      // Enhance with sections and other related data
      return await this.enhanceTechnologyWithRelations(technology);
    } catch (error) {
      console.error(`[technologies:getBySlug] Error:`, error);
      throw error;
    }
  }
  
  /**
   * Override getById to include section relationships
   */
  async getById(id: string): Promise<CMSTechnology | null> {
    try {
      const technology = await super.getById(id);
      
      if (!technology) {
        return null;
      }
      
      // Enhance with sections and other related data
      return await this.enhanceTechnologyWithRelations(technology);
    } catch (error) {
      console.error(`[technologies:getById] Error:`, error);
      throw error;
    }
  }
  
  /**
   * Enhanced create method that handles related data
   */
  async create(data: TechnologyCreateInput): Promise<CMSTechnology> {
    try {
      console.log('[technologies:create] Creating new technology with data:', data);
      
      // Extract sections for separate insertion
      const { sections, ...techData } = data;
      
      // Create the main technology record first
      const { data: technology, error } = await supabase
        .from('technologies')
        .insert(techData)
        .select()
        .single();
        
      if (error) {
        console.error('[technologies:create] Error creating technology:', error);
        throw error;
      }
      
      // Process sections if provided
      if (sections && sections.length > 0) {
        await this.processSections(technology.id, sections);
      }
      
      // Return the complete technology with relations
      return await this.getById(technology.id) as CMSTechnology;
    } catch (error) {
      console.error('[technologies:create] Error:', error);
      throw error;
    }
  }
  
  /**
   * Enhanced update method that handles related data
   */
  async update(id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> {
    try {
      console.log(`[technologies:update] Updating technology ${id} with data:`, data);
      
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
        console.error('[technologies:update] Error updating technology:', error);
        throw error;
      }
      
      // Process sections if provided
      if (sections) {
        await this.processSections(id, sections);
      }
      
      // Return the complete technology with relations
      return await this.getById(id) as CMSTechnology;
    } catch (error) {
      console.error('[technologies:update] Error:', error);
      throw error;
    }
  }
  
  /**
   * Override delete method to handle cascading deletion
   */
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`[technologies:delete] Deleting technology ${id} and related data`);
      
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
        console.error('[technologies:delete] Error deleting technology:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('[technologies:delete] Error:', error);
      throw error;
    }
  }
  
  /**
   * Private helper methods
   */
  
  /**
   * Enhance a technology with its related sections, features and items
   */
  private async enhanceTechnologyWithRelations(technology: CMSTechnology): Promise<CMSTechnology> {
    // Fetch sections
    const { data: sections } = await supabase
      .from('technology_sections')
      .select('*')
      .eq('technology_id', technology.id)
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
    };
  }
  
  /**
   * Process sections for a technology (create, update, delete)
   */
  private async processSections(technologyId: string, sections: any[]): Promise<void> {
    // Get existing sections
    const { data: existingSections } = await supabase
      .from('technology_sections')
      .select('id')
      .eq('technology_id', technologyId);
      
    const existingSectionIds = (existingSections || []).map(section => section.id);
    const updatedSectionIds: string[] = [];
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const { features, ...sectionData } = section;
      
      // Process the section (create or update)
      let sectionId: string;
      
      if (section.id) {
        // Update existing section
        await supabase
          .from('technology_sections')
          .update({
            ...sectionData,
            display_order: i,
            updated_at: new Date().toISOString()
          })
          .eq('id', section.id);
          
        sectionId = section.id;
        updatedSectionIds.push(section.id);
      } else {
        // Create new section
        const { data: newSection } = await supabase
          .from('technology_sections')
          .insert({
            ...sectionData,
            technology_id: technologyId,
            display_order: i
          })
          .select()
          .single();
          
        sectionId = newSection.id;
        updatedSectionIds.push(newSection.id);
      }
      
      // Process features if provided
      if (features && features.length > 0) {
        await this.processFeatures(sectionId, features);
      }
    }
    
    // Delete sections that weren't updated
    const sectionsToDelete = existingSectionIds.filter(id => !updatedSectionIds.includes(id));
    if (sectionsToDelete.length > 0) {
      await supabase
        .from('technology_sections')
        .delete()
        .in('id', sectionsToDelete);
    }
  }
  
  /**
   * Process features for a section (create, update, delete)
   */
  private async processFeatures(sectionId: string, features: any[]): Promise<void> {
    // Get existing features
    const { data: existingFeatures } = await supabase
      .from('technology_features')
      .select('id')
      .eq('section_id', sectionId);
      
    const existingFeatureIds = (existingFeatures || []).map(feature => feature.id);
    const updatedFeatureIds: string[] = [];
    
    // Process each feature
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const { items, ...featureData } = feature;
      
      // Process the feature (create or update)
      let featureId: string;
      
      if (feature.id) {
        // Update existing feature
        await supabase
          .from('technology_features')
          .update({
            ...featureData,
            display_order: i,
            updated_at: new Date().toISOString()
          })
          .eq('id', feature.id);
          
        featureId = feature.id;
        updatedFeatureIds.push(feature.id);
      } else {
        // Create new feature
        const { data: newFeature } = await supabase
          .from('technology_features')
          .insert({
            ...featureData,
            section_id: sectionId,
            display_order: i
          })
          .select()
          .single();
          
        featureId = newFeature.id;
        updatedFeatureIds.push(newFeature.id);
      }
      
      // Process items if provided
      if (items && items.length > 0) {
        await this.processFeatureItems(featureId, items);
      }
    }
    
    // Delete features that weren't updated
    const featuresToDelete = existingFeatureIds.filter(id => !updatedFeatureIds.includes(id));
    if (featuresToDelete.length > 0) {
      await supabase
        .from('technology_features')
        .delete()
        .in('id', featuresToDelete);
    }
  }
  
  /**
   * Process items for a feature (create, update, delete)
   */
  private async processFeatureItems(featureId: string, items: any[]): Promise<void> {
    // Get existing items
    const { data: existingItems } = await supabase
      .from('technology_feature_items')
      .select('id')
      .eq('feature_id', featureId);
      
    const existingItemIds = (existingItems || []).map(item => item.id);
    const updatedItemIds: string[] = [];
    
    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.id) {
        // Update existing item
        await supabase
          .from('technology_feature_items')
          .update({
            ...item,
            display_order: i,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
          
        updatedItemIds.push(item.id);
      } else {
        // Create new item
        const { data: newItem } = await supabase
          .from('technology_feature_items')
          .insert({
            ...item,
            feature_id: featureId,
            display_order: i
          })
          .select()
          .single();
          
        updatedItemIds.push(newItem.id);
      }
    }
    
    // Delete items that weren't updated
    const itemsToDelete = existingItemIds.filter(id => !updatedItemIds.includes(id));
    if (itemsToDelete.length > 0) {
      await supabase
        .from('technology_feature_items')
        .delete()
        .in('id', itemsToDelete);
    }
  }
}

/**
 * Create a factory function for the improved technology adapter
 */
export const createImprovedTechnologyAdapter = (
  config: ContentProviderConfig
): TechnologyAdapter => {
  return new ImprovedTechnologyAdapter(config);
};

export const improvedTechnologyAdapter: TechnologyAdapter = {
  getAll: async (options?: QueryOptions) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.getAll(options);
  },
  
  getBySlug: async (slug: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.getBySlug(slug);
  },
  
  getById: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.getById(id);
  },
  
  create: async (data: TechnologyCreateInput) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.create(data);
  },
  
  update: async (id: string, data: TechnologyUpdateInput) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.update(id, data);
  },
  
  delete: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.delete(id);
  },
  
  clone: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: 'supabase' });
    return await adapter.clone(id);
  }
};
