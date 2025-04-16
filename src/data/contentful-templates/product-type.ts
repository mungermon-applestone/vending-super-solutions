
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const productTemplate: ContentTypeTemplate = {
  id: 'productType', // UPDATED: Changed from 'product' to 'productType' to match Contentful
  name: 'Product Type',
  description: 'Create a product type content type',
  contentType: {
    id: 'productType', // UPDATED: Changed from 'product' to 'productType' to match Contentful
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
      }
    ]
  }
};
