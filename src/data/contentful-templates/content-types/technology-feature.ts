
import { ContentTypeProps } from "@/services/cms/types/contentfulTypes";

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
