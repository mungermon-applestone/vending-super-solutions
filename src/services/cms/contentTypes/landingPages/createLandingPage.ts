
/**
 * Create a landing page
 * This is a simplified version that returns an empty object.
 */

import { LandingPage } from '@/types/landingPage';

export const createLandingPage = async (data: any): Promise<LandingPage> => {
  console.log('Creating landing page with data:', data);
  return {
    id: 'mock-landing-page-id',
    key: data.key || 'mock-key',
    title: data.title || 'Mock Landing Page',
    sections: []
  };
};

export default createLandingPage;
