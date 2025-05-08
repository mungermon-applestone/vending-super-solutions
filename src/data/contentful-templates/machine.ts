
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const machineTemplate: ContentTypeTemplate = {
  id: 'machine',
  name: 'Machine',
  description: 'Create a vending or locker machine content type',
  contentType: {
    id: 'machine',
    name: 'Machine',
    description: 'A vending or locker machine with specifications',
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
        id: 'type',
        name: 'Type',
        type: 'Symbol',
        required: true,
        localized: false,
        validations: [
          {
            in: ['vending', 'locker'],
            message: 'Type must be either vending or locker'
          }
        ]
      },
      {
        id: 'temperature',
        name: 'Temperature',
        type: 'Symbol',
        required: false,
        localized: false,
        validations: [
          {
            in: ['ambient', 'refrigerated', 'frozen', 'multi', 'controlled'],
            message: 'Invalid temperature type'
          }
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
        id: 'features',
        name: 'Features',
        type: 'Array',
        items: {
          type: 'Symbol'
        },
        required: false,
        localized: false,
      },
      {
        id: 'images',
        name: 'Images',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Asset',
          validations: [
            {
              linkMimetypeGroup: ['image']
            }
          ]
        },
        required: false,
        localized: false,
      },
      {
        id: 'machineThumbnail',
        name: 'Machine Thumbnail',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
        validations: [
          {
            linkMimetypeGroup: ['image']
          }
        ]
      },
      {
        id: 'dimensions',
        name: 'Dimensions',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'weight',
        name: 'Weight',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'powerRequirements',
        name: 'Power Requirements',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'capacity',
        name: 'Capacity',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'paymentOptions',
        name: 'Payment Options',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'connectivity',
        name: 'Connectivity',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'manufacturer',
        name: 'Manufacturer',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'warranty',
        name: 'Warranty',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
        localized: false,
      }
    ]
  }
};
