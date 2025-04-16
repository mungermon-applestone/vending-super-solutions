
import { ContentTypeTemplate } from '@/types/contentful-admin';
import { businessGoalTemplate } from './businessGoal';
import { featureTemplate } from './feature';
import { machineTemplate } from './machine';
import { productTemplate } from './product';
import { technologyTemplate } from './technology';
import { heroContentTemplate } from './heroContent';

// Collection of content type templates
export const contentfulTemplates: Record<string, ContentTypeTemplate> = {
  'businessGoal': businessGoalTemplate,
  'feature': featureTemplate,
  'machine': machineTemplate,
  'product': productTemplate,
  'technology': technologyTemplate,
  'heroContent': heroContentTemplate
};
