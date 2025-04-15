
import { blogPostTemplate } from './blog-post';
import { productTypeTemplate } from './product-type';
import { featureTemplate } from './feature';
import { businessGoalTemplate } from './business-goal';
import { machineTemplate } from './machine';
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const contentTypeTemplates: Record<string, ContentTypeTemplate> = {
  blogPost: blogPostTemplate,
  productType: productTypeTemplate,
  feature: featureTemplate,
  businessGoal: businessGoalTemplate,
  machine: machineTemplate,
};
