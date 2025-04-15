
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
      required: false
    }
  ],
  publish: true
};

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

export const technologyFeatureContentType: ContentTypeProps = {
  id: 'technologyFeature',
  name: 'Technology Feature',
  description: 'A feature within a technology section',
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
      required: true,
      localized: false
    },
    {
      id: 'icon',
      name: 'Icon',
      type: 'Symbol',
      required: false,
      localized: false,
      validations: [
        {
          in: [
            'Cloud', 
            'Clock', 
            'Box', 
            'Network', 
            'UploadCloud', 
            'ArrowDownToLine',
            'ShieldCheck', 
            'CreditCard',
            'Database', 
            'Users', 
            'Mail',
            'Layers',
            'BarChartBig',
            'Zap',
            'Wifi',
            'Settings'
          ]
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
      id: 'items',
      name: 'List Items',
      type: 'Array',
      items: {
        type: 'Symbol'
      },
      required: false,
      localized: false
    }
  ],
  publish: true
};
