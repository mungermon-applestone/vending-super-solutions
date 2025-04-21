
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const businessGoalsPageContentTemplate: ContentTypeTemplate = {
  id: 'businessGoalsPageContent',
  name: 'Business Goals Page Content',
  description: 'Content sections for the Business Goals page',
  contentType: {
    id: 'businessGoalsPageContent',
    name: 'Business Goals Page Content',
    description: 'Text and buttons for Business Goals page',
    displayField: 'introTitle',
    publish: true,
    fields: [
      {
        id: 'introTitle',
        name: 'Intro Title',
        type: 'Symbol',
        required: true,
        localized: false,
      },
      {
        id: 'introDescription',
        name: 'Intro Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'customSolutionTitle',
        name: 'Custom Solution Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'customSolutionDescription',
        name: 'Custom Solution Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'customSolutionButtonText',
        name: 'Custom Solution Button Text',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'customSolutionButtonUrl',
        name: 'Custom Solution Button URL',
        type: 'Symbol',
        required: false,
        localized: false,
      },
    ],
  },
};
