
import { ContentTypeTemplate } from '@/types/contentful-admin';
import { technologyContentType, technologySectionContentType, technologyFeatureContentType } from './technology';
import { homePageContentTemplate } from './home-page-content';
import { productsPageContentTemplate } from './products-page-content';
import { businessGoalsPageContentTemplate } from './business-goals-page-content';
import { technologyPageContentTemplate } from './technology-page-content';
import { machinesPageContentTemplate } from './machines-page-content';
import { contactPageContentTemplate } from './contact-page-content';
import { blogPageContentTemplate } from './blog-page-content';
import { caseStudiesPageContentTemplate } from './case-studies-page-content';
import { formsTextContentTemplate } from './forms-text-content';
import { errorStatesContentTemplate } from './error-states-content';

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
  },
  homePageContent: homePageContentTemplate,
  productsPageContent: productsPageContentTemplate,
  businessGoalsPageContent: businessGoalsPageContentTemplate,
  technologyPageContent: technologyPageContentTemplate,
  machinesPageContent: machinesPageContentTemplate,
  contactPageContent: contactPageContentTemplate,
  blogPageContent: blogPageContentTemplate,
  caseStudiesPageContent: caseStudiesPageContentTemplate,
  formsTextContent: formsTextContentTemplate,
  errorStatesContent: errorStatesContentTemplate
};

export * from './home-page-content';
export * from './products-page-content';
export * from './business-goals-page-content';
export * from './technology-page-content';
export * from './machines-page-content';
export * from './contact-page-content';
export * from './blog-page-content';
export * from './case-studies-page-content';
export * from './forms-text-content';
export * from './error-states-content';

export default contentfulTemplates;
