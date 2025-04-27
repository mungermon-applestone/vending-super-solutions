
import { ContentProviderConfig, ContentProviderType } from '../types';
import { TechnologyAdapter } from './types';
import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

export function getTechnologyAdapter(config: ContentProviderConfig): TechnologyAdapter {
  try {
    switch (config.type) {
      case ContentProviderType.CONTENTFUL:
      default:
        console.log('[technologyAdapterFactory] Using Contentful technology adapter');
        return contentfulTechnologyAdapter;
    }
  } catch (error) {
    console.error('[technologyAdapterFactory] Error creating technology adapter:', error);
    throw handleCMSError(error, 'initialize', 'TechnologyAdapter');
  }
}

export { contentfulTechnologyAdapter };
