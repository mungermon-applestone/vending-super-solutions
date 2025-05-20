
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';

export const contentfulClient = createClient({
  space: CONTENTFUL_CONFIG.SPACE_ID || '',
  accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN || '',
  environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
});

export default contentfulClient;
