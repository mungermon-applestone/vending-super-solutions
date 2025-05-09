
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { ContentProviderConfig, ContentProviderType } from '../types';

/**
 * Mock implementation of the improved technology adapter
 * This is a placeholder that returns mock data instead of trying to access Supabase tables
 */
export class ImprovedTechnologyAdapter implements TechnologyAdapter {
  private config: ContentProviderConfig;
  
  constructor(config: ContentProviderConfig) {
    this.config = config;
  }
  
  /**
   * Get all technologies
   */
  async getAll(options?: QueryOptions): Promise<CMSTechnology[]> {
    console.log(`[ImprovedTechnologyAdapter:getAll] Mock implementation returning empty array`);
    return [];
  }
  
  /**
   * Get technology by slug
   */
  async getBySlug(slug: string): Promise<CMSTechnology | null> {
    console.log(`[ImprovedTechnologyAdapter:getBySlug] Mock implementation returning null for slug: ${slug}`);
    return null;
  }
  
  /**
   * Get technology by ID
   */
  async getById(id: string): Promise<CMSTechnology | null> {
    console.log(`[ImprovedTechnologyAdapter:getById] Mock implementation returning null for id: ${id}`);
    return null;
  }
  
  /**
   * Create technology
   */
  async create(data: TechnologyCreateInput): Promise<CMSTechnology> {
    console.log(`[ImprovedTechnologyAdapter:create] Mock implementation returning mock data`);
    return {
      id: 'mock-id-' + Date.now(),
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || '',
      visible: true,
      sections: []
    };
  }
  
  /**
   * Update technology
   */
  async update(id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> {
    console.log(`[ImprovedTechnologyAdapter:update] Mock implementation returning mock data`);
    return {
      id: id,
      title: data.title || 'Mock Technology',
      slug: data.slug || 'mock-technology',
      description: data.description || '',
      visible: data.visible === undefined ? true : data.visible,
      sections: []
    };
  }
  
  /**
   * Delete technology
   */
  async delete(id: string): Promise<boolean> {
    console.log(`[ImprovedTechnologyAdapter:delete] Mock implementation returning true for id: ${id}`);
    return true;
  }
  
  /**
   * Clone technology
   */
  async clone(id: string): Promise<CMSTechnology | null> {
    console.log(`[ImprovedTechnologyAdapter:clone] Mock implementation returning mock data for id: ${id}`);
    return {
      id: 'cloned-' + id,
      title: 'Cloned Technology',
      slug: 'cloned-technology-' + Date.now(),
      description: 'This is a cloned technology',
      visible: true,
      sections: []
    };
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

/**
 * Export an instance of the improved technology adapter
 */
export const improvedTechnologyAdapter: TechnologyAdapter = {
  getAll: async (options?: QueryOptions) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.getAll(options);
  },
  
  getBySlug: async (slug: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.getBySlug(slug);
  },
  
  getById: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.getById(id);
  },
  
  create: async (data: TechnologyCreateInput) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.create(data);
  },
  
  update: async (id: string, data: TechnologyUpdateInput) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.update(id, data);
  },
  
  delete: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.delete(id);
  },
  
  clone: async (id: string) => {
    const adapter = new ImprovedTechnologyAdapter({ type: ContentProviderType.SUPABASE });
    return await adapter.clone(id);
  }
};
