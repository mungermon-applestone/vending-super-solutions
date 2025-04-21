
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const blogPageContentTemplate: ContentTypeTemplate = {
  id: 'blogPageContent',
  name: 'Blog Page Content',
  description: 'Content for the Blog page: intros, newsletter, etc.',
  contentType: {
    id: 'blogPageContent',
    name: 'Blog Page Content',
    description: 'Sectional content for the Blog page',
    displayField: 'introTitle',
    publish: true,
    fields: [
      { id: 'introTitle', name: 'Intro Title', type: 'Symbol', required: true, localized: false },
      { id: 'introDescription', name: 'Intro Description', type: 'Text', required: false, localized: false },
      { id: 'featuredPostsTitle', name: 'Featured Posts Title', type: 'Symbol', required: false, localized: false },
      { id: 'latestArticlesTitle', name: 'Latest Articles Title', type: 'Symbol', required: false, localized: false },
      { id: 'newsletterTitle', name: 'Newsletter Title', type: 'Symbol', required: false, localized: false },
      { id: 'newsletterDescription', name: 'Newsletter Description', type: 'Text', required: false, localized: false },
      { id: 'newsletterButtonText', name: 'Newsletter Button Text', type: 'Symbol', required: false, localized: false },
      { id: 'newsletterPlaceholder', name: 'Newsletter Placeholder', type: 'Symbol', required: false, localized: false },
    ],
  },
};
