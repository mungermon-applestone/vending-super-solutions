
import { ContentTypeTemplate } from '@/types/contentful-admin';

/**
 * Hero Content template for Contentful
 * This allows creation of hero content sections for various pages
 */
export const heroContentTemplate: ContentTypeTemplate = {
  id: 'heroContent',
  name: 'Hero Content',
  description: 'Page hero content with title, subtitle, image, and CTA buttons',
  contentType: {
    id: 'heroContent',
    name: 'Hero Content',
    description: 'Content for page hero sections',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
        localized: false,
        validations: [
          {
            size: {
              min: 3,
              max: 100
            }
          }
        ]
      },
      {
        id: 'subtitle',
        name: 'Subtitle',
        type: 'Text',
        required: true,
        localized: false,
        validations: [
          {
            size: {
              min: 10,
              max: 300
            }
          }
        ]
      },
      {
        id: 'pageKey',
        name: 'Page Key',
        type: 'Symbol',
        required: true,
        localized: false,
        validations: [
          {
            in: [
              'home',
              'products',
              'machines',
              'business-goals',
              'technology',
              'contact',
              'about',
              'services'
            ]
          }
        ],
        helpText: 'Unique identifier for the page this hero belongs to'
      },
      {
        id: 'image',
        name: 'Hero Image',
        type: 'Link',
        linkType: 'Asset',
        required: true,
        localized: false
      },
      {
        id: 'imageAlt',
        name: 'Image Alt Text',
        type: 'Symbol',
        required: true,
        localized: false
      },
      {
        id: 'primaryButtonText',
        name: 'Primary Button Text',
        type: 'Symbol',
        required: false,
        localized: false
      },
      {
        id: 'primaryButtonUrl',
        name: 'Primary Button URL',
        type: 'Symbol',
        required: false,
        localized: false
      },
      {
        id: 'secondaryButtonText',
        name: 'Secondary Button Text',
        type: 'Symbol',
        required: false,
        localized: false
      },
      {
        id: 'secondaryButtonUrl',
        name: 'Secondary Button URL',
        type: 'Symbol',
        required: false,
        localized: false
      },
      {
        id: 'backgroundClass',
        name: 'Background Class',
        type: 'Symbol',
        required: false,
        localized: false,
        defaultValue: {
          'en-US': 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light'
        },
        helpText: 'Tailwind CSS classes for the hero background'
      }
    ]
  }
};
