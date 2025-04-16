
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const businessGoalTemplate: ContentTypeTemplate = {
  id: 'businessGoal',
  name: 'Business Goal',
  description: 'Content type for business goals',
  contentType: {
    id: 'businessGoal',
    name: 'Business Goal',
    description: 'Business goal for vending solutions',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
        localized: false
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        localized: false,
        validations: [
          { unique: true }
        ]
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
        localized: false
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        required: false,
        localized: false
      },
      {
        id: 'image',
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false
      },
      {
        id: 'benefits',
        name: 'Benefits',
        type: 'Array',
        items: {
          type: 'Symbol',
        },
        required: false,
        localized: false
      },
      {
        id: 'features',
        name: 'Features',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['feature']
            }
          ]
        },
        required: false,
        localized: false
      },
      {
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
        localized: false
      }
    ]
  }
};
