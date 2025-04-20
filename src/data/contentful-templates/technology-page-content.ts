
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const technologyPageContentTemplate: ContentTypeTemplate = {
  id: 'technologyPageContent',
  name: 'Technology Page Content',
  description: 'Content for the Technology page: sections, CTAs, and bullet points',
  contentType: {
    id: 'technologyPageContent',
    name: 'Technology Page Content',
    description: 'Sectional content for the Technology page',
    displayField: 'introTitle',
    publish: true,
    fields: [
      {
        id: 'introTitle',
        name: 'Intro Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'introDescription',
        name: 'Intro Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'cloudSectionTitle',
        name: 'Cloud Section Title',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'cloudSectionDescription',
        name: 'Cloud Section Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'cloudSectionBulletPoints',
        name: 'Cloud Section Bullet Points',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      {
        id: 'realTimeTitle',
        name: 'Real-Time Section Title',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'realTimeDescription',
        name: 'Real-Time Section Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'realTimeBulletPoints',
        name: 'Real-Time Bullet Points',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      {
        id: 'ctaTitle',
        name: 'CTA Title',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'ctaDescription',
        name: 'CTA Description',
        type: 'Text',
        required: false,
      },
      {
        id: 'ctaButtonText',
        name: 'CTA Button Text',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'ctaButtonUrl',
        name: 'CTA Button URL',
        type: 'Symbol',
        required: false,
      },
    ],
  },
};
