
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const caseStudiesPageContentTemplate: ContentTypeTemplate = {
  id: 'caseStudiesPageContent',
  name: 'Case Studies Page Content',
  description: 'Content for the Case Studies page: featured, intro, etc.',
  contentType: {
    id: 'caseStudiesPageContent',
    name: 'Case Studies Page Content',
    description: 'Sectional content for the Case Studies page',
    displayField: 'introTitle',
    publish: true,
    fields: [
      { id: 'introTitle', name: 'Intro Title', type: 'Symbol', required: true },
      { id: 'introDescription', name: 'Intro Description', type: 'Text', required: false },
      { id: 'featuredStoryTitle', name: 'Featured Story Title', type: 'Symbol', required: false },
      { id: 'allCaseStudiesTitle', name: 'All Case Studies Title', type: 'Symbol', required: false },
    ],
  },
};
