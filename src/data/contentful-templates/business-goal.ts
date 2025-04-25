
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const businessGoalTemplate: ContentTypeTemplate = {
  id: 'businessGoal',
  name: 'Business Goal',
  description: 'Create a business goal content type',
  contentType: {
    id: 'businessGoal',
    name: 'Business Goal',
    description: 'A business goal',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
        localized: false,
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
        localized: false,
      },
      {
        id: 'image',
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'benefits',
        name: 'Benefits',
        type: 'Array',
        items: {
          type: 'Symbol',
        },
        required: false,
        localized: false,
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
        localized: false,
      },
      {
        id: 'video',
        name: 'Video',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
        validations: [
          {
            linkMimetypeGroup: ['video']
          }
        ]
      },
      {
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
        localized: false,
      },
      {
        id: 'recommendedMachines',
        name: 'Recommended Machines',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['machine']
            }
          ]
        },
        required: false,
        localized: false,
      }
    ]
  }
};
