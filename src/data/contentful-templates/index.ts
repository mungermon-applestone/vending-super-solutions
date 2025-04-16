
import { ContentTypeTemplate } from '@/types/contentful-admin';
import { technologyContentType, technologySectionContentType, technologyFeatureContentType } from './technology';

export const contentfulTemplates: Record<string, ContentTypeTemplate> = {
  technology: {
    id: 'technology',
    name: 'Technology',
    description: 'Technology platform details and features',
    contentType: technologyContentType
  },
  technologySection: {
    id: 'technologySection',
    name: 'Technology Section',
    description: 'A section within the technology platform',
    contentType: technologySectionContentType
  },
  technologyFeature: {
    id: 'technologyFeature',
    name: 'Technology Feature',
    description: 'A feature within a technology section',
    contentType: technologyFeatureContentType
  }
};

export default contentfulTemplates;
