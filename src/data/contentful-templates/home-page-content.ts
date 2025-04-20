
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const homePageContentTemplate: ContentTypeTemplate = {
  id: 'homePageContent',
  name: 'Home Page Content',
  description: 'Content sections for the Home page',
  contentType: {
    id: 'homePageContent',
    name: 'Home Page Content',
    description: 'Text and CTA content for the Home page',
    displayField: 'productCategoriesTitle',
    publish: true,
    fields: [
      {
        id: 'productCategoriesTitle',
        name: 'Product Categories Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'productCategoriesDescription',
        name: 'Product Categories Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'businessGoalsTitle',
        name: 'Business Goals Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'businessGoalsDescription',
        name: 'Business Goals Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'ctaSectionTitle',
        name: 'CTA Section Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'ctaSectionDescription',
        name: 'CTA Section Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'ctaPrimaryButtonText',
        name: 'CTA Primary Button Text',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'ctaPrimaryButtonUrl',
        name: 'CTA Primary Button URL',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'ctaSecondaryButtonText',
        name: 'CTA Secondary Button Text',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'ctaSecondaryButtonUrl',
        name: 'CTA Secondary Button URL',
        type: 'Symbol',
        required: false,
      },
    ],
  },
};

