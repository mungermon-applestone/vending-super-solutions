
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Implementation of the Technology Adapter for Supabase
 */
export const supabaseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (options?: QueryOptions): Promise<CMSTechnology[]> => {
    console.log('[supabaseTechnologyAdapter] Supabase CMS is disabled, returning empty array');
    return [];
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning null`);
    return null;
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning null`);
    return null;
  },
  
  create: async (technology: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning mock data`);
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
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning mock data`);
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
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning true`);
    return true;
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabaseTechnologyAdapter] Supabase CMS is disabled, returning mock data`);
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
