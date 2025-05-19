
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
        id: 'heroTitle',
        name: 'Hero Title',
        type: 'Symbol',
        required: true,
        localized: false,
      },
      {
        id: 'heroDescription',
        name: 'Hero Description',
        type: 'Text',
        required: true,
        localized: false,
      },
      {
        id: 'heroImage',
        name: 'Hero Image',
        type: 'Link',
        required: false,
        localized: false,
        linkType: 'Asset',
      },
      {
        id: 'heroPrimaryButtonText',
        name: 'Hero Primary Button Text',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'heroPrimaryButtonUrl',
        name: 'Hero Primary Button URL',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'heroSecondaryButtonText',
        name: 'Hero Secondary Button Text',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'heroSecondaryButtonUrl',
        name: 'Hero Secondary Button URL',
        type: 'Symbol',
        required: false,
        localized: false,
      },
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
      {
        id: 'goalsSectionTitle',
        name: 'Goals Section Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'goalsSectionDescription',
        name: 'Goals Section Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'keyBenefitsTitle',
        name: 'Key Benefits Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'keyBenefitsDescription',
        name: 'Key Benefits Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'keyBenefits',
        name: 'Key Benefits',
        type: 'Array',
        required: false,
        localized: false,
        items: {
          type: 'Symbol'
        }
      },
      {
        id: 'testimonialsSectionTitle',
        name: 'Testimonials Section Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'testimonialsSectionDescription',
        name: 'Testimonials Section Description',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'inquiryBulletPoints',
        name: 'Inquiry Bullet Points',
        type: 'Array',
        required: false,
        localized: false,
        items: {
          type: 'Symbol'
        }
      }
    ],
  },
};
