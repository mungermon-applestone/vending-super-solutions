
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology } from '@/types/cms';

/**
 * Mock implementation of the Technology Adapter for Supabase
 * This adapter returns empty/mock data and doesn't actually access Supabase
 */
export const supabaseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (): Promise<CMSTechnology[]> => {
    console.log('[supabaseTechnologyAdapter] Returning empty array');
    return [];
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning null for slug: ${slug}`);
    return null;
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning null for id: ${id}`);
    return null;
  },
  
  create: async (technology: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log(`[supabaseTechnologyAdapter] Returning mock data for new technology`);
    return {
      id: 'mock-id-' + Date.now(),
      title: technology.title,
      slug: technology.slug || technology.title.toLowerCase().replace(/\s+/g, '-'),
      description: technology.description || '',
      visible: true,
      sections: []
    };
  },
  
  update: async (id: string, technology: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[supabaseTechnologyAdapter] Returning mock data for updated technology`);
    return {
      id: id,
      title: technology.title || 'Updated Technology',
      slug: technology.slug || 'updated-technology',
      description: technology.description || '',
      visible: technology.visible !== undefined ? technology.visible : true,
      sections: []
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseTechnologyAdapter] Successfully deleted technology (mock)`);
    return true;
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning cloned technology (mock)`);
    return {
      id: 'cloned-' + id,
      title: 'Cloned Technology',
      slug: 'cloned-technology-' + Date.now(),
      description: '',
      visible: true,
      sections: []
    };
  }
};
