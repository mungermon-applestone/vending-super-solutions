
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { supabaseTechnologyAdapter } from './supabase';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  try {
    switch (config.type) {
      case ContentProviderType.CONTENTFUL:
        console.log('[technologyAdapterFactory] Using Contentful technology adapter');
        return contentfulTechnologyAdapter;
      case ContentProviderType.SUPABASE:
        console.warn('[technologyAdapterFactory] Using Supabase technology adapter (deprecated)');
        return supabaseTechnologyAdapter;
      default:
        console.log('[technologyAdapterFactory] No specific adapter found, using Contentful as default');
        return contentfulTechnologyAdapter;
    }
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    throw handleCMSError(error, 'initialize', 'TechnologyAdapter');
  }
}

export { contentfulTechnologyAdapter, supabaseTechnologyAdapter };
