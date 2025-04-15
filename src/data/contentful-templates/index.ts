
import { businessGoalContentType } from './business-goal';
import { featureContentType } from './feature';
import { machineContentType } from './machine';
import { productTypeContentType } from './product-type';
import { blogPostContentType } from './blog-post';
import { technologyContentType, technologySectionContentType, technologyFeatureContentType } from './technology';

export const contentfulTemplates = {
  businessGoal: businessGoalContentType,
  feature: featureContentType,
  machine: machineContentType,
  productType: productTypeContentType,
  blogPost: blogPostContentType,
  technology: technologyContentType,
  technologySection: technologySectionContentType,
  technologyFeature: technologyFeatureContentType
};

export default contentfulTemplates;
