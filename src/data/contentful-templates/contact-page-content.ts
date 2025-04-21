
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const contactPageContentTemplate: ContentTypeTemplate = {
  id: 'contactPageContent',
  name: 'Contact Page Content',
  description: 'Content for the Contact page: cards, details, form, FAQ',
  contentType: {
    id: 'contactPageContent',
    name: 'Contact Page Content',
    description: 'Sectional and card content for the Contact page',
    displayField: 'introTitle',
    publish: true,
    fields: [
      { id: 'introTitle', name: 'Intro Title', type: 'Symbol', required: true, localized: false },
      { id: 'introDescription', name: 'Intro Description', type: 'Text', required: false, localized: false },
      { id: 'phoneCardTitle', name: 'Phone Card Title', type: 'Symbol', required: false, localized: false },
      { id: 'phoneNumber', name: 'Phone Number', type: 'Symbol', required: false, localized: false },
      { id: 'phoneAvailability', name: 'Phone Availability', type: 'Symbol', required: false, localized: false },
      { id: 'emailCardTitle', name: 'Email Card Title', type: 'Symbol', required: false, localized: false },
      { id: 'emailAddress', name: 'Email Address', type: 'Symbol', required: false, localized: false },
      { id: 'emailResponseTime', name: 'Email Response Time', type: 'Symbol', required: false, localized: false },
      { id: 'addressCardTitle', name: 'Address Card Title', type: 'Symbol', required: false, localized: false },
      { id: 'address', name: 'Address', type: 'Text', required: false, localized: false },
      { id: 'addressType', name: 'Address Type', type: 'Symbol', required: false, localized: false },
      { id: 'formSectionTitle', name: 'Form Section Title', type: 'Symbol', required: false, localized: false },
      { id: 'faqSectionTitle', name: 'FAQ Section Title', type: 'Symbol', required: false, localized: false },
      {
        id: 'faqItems',
        name: 'FAQ Items',
        type: 'Array',
        required: false,
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [ { linkContentType: ['faqItem'] } ]
        }
      },
      { id: 'immediateAssistanceTitle', name: 'Immediate Assistance Title', type: 'Symbol', required: false, localized: false },
      { id: 'immediateAssistanceDescription', name: 'Immediate Assistance Description', type: 'Symbol', required: false, localized: false },
      { id: 'immediateAssistanceButtonText', name: 'Immediate Assistance Button Text', type: 'Symbol', required: false, localized: false },
    ],
  },
};
