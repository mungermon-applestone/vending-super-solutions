
import { ContentTypeProps } from "@/services/cms/types/contentfulTypes";

export const technologyContentType: ContentTypeProps = {
  id: 'technology',
  name: 'Technology',
  description: 'Technology platform details',
  displayField: 'title',
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
      name: 'URL Slug',
      type: 'Symbol',
      required: true,
      localized: false,
      validations: [
        {
          unique: true
        },
        {
          regexp: {
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
            flags: ''
          },
          message: 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
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
      name: 'Hero Image',
      type: 'Link',
      linkType: 'Asset',
      required: false,
      localized: false
    },
    {
      id: 'sections',
      name: 'Technology Sections',
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
    },
    {
      id: 'visible',
      name: 'Visible',
      type: 'Boolean',
      required: false,
      localized: false
    }
  ],
  publish: true
};
