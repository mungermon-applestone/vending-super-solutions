
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const productsPageContentTemplate: ContentTypeTemplate = {
  id: 'productsPageContent',
  name: 'Products Page Content',
  description: 'Content sections for the Products page',
  contentType: {
    id: 'productsPageContent',
    name: 'Products Page Content',
    description: 'Text, section titles, and bullet points for Products page',
    displayField: 'purposeStatementTitle',
    publish: true,
    fields: [
      {
        id: 'purposeStatementTitle',
        name: 'Purpose Statement Title',
        type: 'Symbol',
        required: true,
        localized: false,
      },
      {
        id: 'purposeStatementDescription',
        name: 'Purpose Statement Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'categoriesSectionTitle',
        name: 'Categories Section Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'categoriesSectionDescription',
        name: 'Categories Section Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'keyFeaturesTitle',
        name: 'Key Features Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'keyFeaturesDescription',
        name: 'Key Features Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'demoRequestTitle',
        name: 'Demo Request Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'demoRequestDescription',
        name: 'Demo Request Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'demoRequestBulletPoints',
        name: 'Demo Request Bullet Points',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
        localized: false,
      },
    ],
  },
};
