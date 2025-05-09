
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology } from '@/types/cms';

/**
 * Mock implementation of the Technology Adapter for Supabase
 */
export const supabaseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (): Promise<CMSTechnology[]> => {
    console.log('[supabaseTechnologyAdapter] Returning empty array');
    return [];
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning null`);
    return null;
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning null`);
    return null;
  },
  
  create: async (technology: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log(`[supabaseTechnologyAdapter] Returning mock data`);
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
    console.log(`[supabaseTechnologyAdapter] Returning mock data`);
    return {
      id: id,
      title: technology.title,
      slug: technology.slug || 'updated-technology',
      description: technology.description || '',
      visible: technology.visible || true,
      sections: []
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseTechnologyAdapter] Returning true`);
    return true;
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Returning mock data`);
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
