import { ContentTypeTemplate } from '@/types/contentful-admin';

export const formsTextContentTemplate: ContentTypeTemplate = {
  id: 'formsTextContent',
  name: 'Forms Text Content',
  description: 'Common text and messages for forms (demo, contact, machine inquiry, terms, etc.)',
  contentType: {
    id: 'formsTextContent',
    name: 'Forms Text Content',
    description: 'All static text for forms (success, terms, consent)',
    displayField: 'demoRequestSuccessTitle',
    publish: true,
    fields: [
      // Demo Request
      { id: 'demoRequestSuccessTitle', name: 'Demo Request Success Title', type: 'Symbol', required: false, localized: false },
      { id: 'demoRequestSuccessMessage', name: 'Demo Request Success Message', type: 'Text', required: false, localized: false },
      { id: 'demoRequestButtonText', name: 'Demo Request Button Text', type: 'Symbol', required: false, localized: false },
      // Contact Form
      { id: 'contactFormSuccessTitle', name: 'Contact Form Success Title', type: 'Symbol', required: false, localized: false },
      { id: 'contactFormSuccessMessage', name: 'Contact Form Success Message', type: 'Text', required: false, localized: false },
      { id: 'contactFormButtonText', name: 'Contact Form Button Text', type: 'Symbol', required: false, localized: false },
      // Machine Inquiry
      { id: 'machineInquirySuccessTitle', name: 'Machine Inquiry Success Title', type: 'Symbol', required: false, localized: false },
      { id: 'machineInquirySuccessMessage', name: 'Machine Inquiry Success Message', type: 'Text', required: false, localized: false },
      { id: 'machineInquiryButtonText', name: 'Machine Inquiry Button Text', type: 'Symbol', required: false, localized: false },
      // Other
      { id: 'termsText', name: 'Terms and Conditions Text', type: 'Text', required: false, localized: false },
      { id: 'privacyText', name: 'Privacy Policy Text', type: 'Text', required: false, localized: false },
      { id: 'marketingConsentText', name: 'Marketing Consent Text', type: 'Text', required: false, localized: false },
    ],
  },
};
