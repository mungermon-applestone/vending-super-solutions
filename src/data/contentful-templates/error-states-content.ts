
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const errorStatesContentTemplate: ContentTypeTemplate = {
  id: 'errorStatesContent',
  name: 'Error States Content',
  description: 'Contentful content type for error handling messages',
  contentType: {
    id: 'errorStatesContent',
    name: 'Error States Content',
    description: 'Titles and messages for error and fallback UI states',
    displayField: 'contentNotFoundTitle',
    publish: true,
    fields: [
      { id: 'contentNotFoundTitle', name: 'Content Not Found Title', type: 'Symbol', required: false, localized: false },
      { id: 'contentNotFoundMessage', name: 'Content Not Found Message', type: 'Text', required: false, localized: false },
      { id: 'generalErrorTitle', name: 'General Error Title', type: 'Symbol', required: false, localized: false },
      { id: 'generalErrorMessage', name: 'General Error Message', type: 'Text', required: false, localized: false },
      { id: 'tryAgainButtonText', name: 'Try Again Button Text', type: 'Symbol', required: false, localized: false },
    ],
  },
};
