
// Import all content type templates
import { productTypeTemplate } from './product-type';
import { businessGoalTemplate } from './business-goal';
import { machineTemplate } from './machine';
import { featureTemplate } from './feature';
import { blogPostTemplate } from './blog-post';
import { blogPageContentTemplate } from './blog-page-content';
import { contactPageContentTemplate } from './contact-page-content';
import { productsPageContentTemplate } from './products-page-content';
import { machinesPageContentTemplate } from './machines-page-content';
import { homePageContentTemplate } from './home-page-content';
import { businessGoalsPageContentTemplate } from './business-goals-page-content';
import { technologyPageContentTemplate } from './technology-page-content';
import { caseStudiesPageContentTemplate } from './case-studies-page-content';
import { errorStatesContentTemplate } from './error-states-content';
import { formsTextContentTemplate } from './forms-text-content';
import { ContentTypeTemplate } from '@/types/contentful-admin';

// Export all templates in an array
export const contentfulTemplates: ContentTypeTemplate[] = [
  productTypeTemplate,
  businessGoalTemplate,
  machineTemplate,
  featureTemplate,
  blogPostTemplate,
  blogPageContentTemplate,
  contactPageContentTemplate,
  productsPageContentTemplate,
  machinesPageContentTemplate,
  homePageContentTemplate,
  businessGoalsPageContentTemplate,
  technologyPageContentTemplate,
  caseStudiesPageContentTemplate,
  errorStatesContentTemplate,
  formsTextContentTemplate,
];

// Export all templates individually
export {
  productTypeTemplate,
  businessGoalTemplate,
  machineTemplate,
  featureTemplate,
  blogPostTemplate,
  blogPageContentTemplate,
  contactPageContentTemplate,
  productsPageContentTemplate,
  machinesPageContentTemplate,
  homePageContentTemplate,
  businessGoalsPageContentTemplate,
  technologyPageContentTemplate,
  caseStudiesPageContentTemplate,
  errorStatesContentTemplate,
  formsTextContentTemplate,
};
