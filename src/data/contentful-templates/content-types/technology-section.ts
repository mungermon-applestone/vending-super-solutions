
import { ContentTypeProps } from "@/services/cms/types/contentfulTypes";

export const technologySectionContentType: ContentTypeProps = {
  id: 'technologySection',
  name: 'Technology Section',
  description: 'A section within the technology page',
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
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
      localized: false
    },
    {
      id: 'sectionType',
      name: 'Section Type',
      type: 'Symbol',
      required: true,
      localized: false,
      validations: [
        {
          in: ['architecture', 'security', 'integration', 'hardware', 'standards', 'analytics']
        }
      ]
    },
    {
      id: 'displayOrder',
      name: 'Display Order',
      type: 'Integer',
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
            linkContentType: ['technologyFeature']
          }
        ]
      },
      required: false,
      localized: false
    }
  ],
  publish: true
};
