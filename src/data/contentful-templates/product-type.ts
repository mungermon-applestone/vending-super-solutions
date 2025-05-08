
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const productTypeTemplate: ContentTypeTemplate = {
  id: 'productType',
  name: 'Product Type',
  description: 'Create a product type for vending machines',
  contentType: {
    id: 'productType',
    name: 'Product Type',
    description: 'A vending machine product type',
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
        name: 'Main Image',
        type: 'Link',
        linkType: 'Asset',
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
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
        localized: false,
      },
      {
        id: 'video',
        name: 'Video',
        type: 'Link',
        linkType: 'Asset',
        validations: [
          {
            linkMimetypeGroup: ['video']
          }
        ],
        required: false,
        localized: false,
      },
      {
        id: 'videoTitle',
        name: 'Video Title',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'videoPreviewImage',
        name: 'Video Preview Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
      },
      {
        id: 'videoDescription',
        name: 'Video Description',
        type: 'Text',
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
        validations: [
          {
            size: {
              min: 0,
              max: 3
            }
          }
        ]
      }
    ]
  }
};
