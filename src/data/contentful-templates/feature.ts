
import { ContentTypeTemplate, AVAILABLE_ICONS } from '@/types/contentful-admin';

export const featureTemplate: ContentTypeTemplate = {
  id: 'feature',
  name: 'Feature',
  description: 'Create a feature that can be used in products or business goals',
  contentType: {
    id: 'feature',
    name: 'Feature',
    description: 'A feature for products or business goals',
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
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
        localized: false,
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        required: false,
        localized: false,
        validations: [
          {
            in: AVAILABLE_ICONS.map(icon => icon.value),
            message: 'Please select a valid icon'
          }
        ]
      },
      {
        id: 'screenshot',
        name: 'Screenshot',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
      }
    ]
  }
};
