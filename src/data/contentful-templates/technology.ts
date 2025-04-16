
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const technologyTemplate: ContentTypeTemplate = {
  id: 'technology',
  name: 'Technology',
  description: 'Technology content type for describing technologies used in products',
  contentType: {
    id: 'technology',
    name: 'Technology',
    description: 'A technology used in products',
    displayField: 'name',
    publish: true,
    fields: [
      {
        id: 'name',
        name: 'Name',
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
        id: 'image',
        name: 'Featured Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false
      },
      {
        id: 'sections',
        name: 'Sections',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['technologySection']
            }
          ]
        },
        required: false,
        localized: false
      }
    ]
  }
};
