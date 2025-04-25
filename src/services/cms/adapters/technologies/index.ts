
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { improvedTechnologyAdapter } from './improvedTechnologyAdapter';

export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  try {
    switch (config.type) {
      case ContentProviderType.SUPABASE:
      default:
        console.log('[technologyAdapterFactory] Using Improved Supabase technology adapter');
        return improvedTechnologyAdapter;
    }
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    return improvedTechnologyAdapter;
  }
}

export { improvedTechnologyAdapter };
