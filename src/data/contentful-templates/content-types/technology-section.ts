
import { ContentTypeProps } from "@/services/cms/types/contentfulTypes";

export const technologySectionContentType: ContentTypeProps = {
  id: 'technologySection',
  name: 'Technology Section',
  description: 'A section within the technology page with alternating layout',
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
      id: 'summary',
      name: 'Summary',
      type: 'Text',
      required: true,
      localized: false
    },
    {
      id: 'bulletPoints',
      name: 'Bullet Points',
      type: 'Array',
      items: {
        type: 'Symbol'
      },
      required: false,
      localized: false
    },
    {
      id: 'image',
      name: 'Section Image',
      type: 'Link',
      linkType: 'Asset',
      required: true,
      localized: false,
      validations: [
        {
          linkMimetypeGroup: ['image']
        }
      ]
    },
    {
      id: 'displayOrder',
      name: 'Display Order',
      type: 'Integer',
      required: false,
      localized: false
    }
  ],
  publish: true
};
