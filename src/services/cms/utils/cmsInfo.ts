
/**
 * CMS information utility
 */

export const getCMSInfo = () => {
  return {
    provider: 'Contentful',
    status: 'configured',
    apiUrl: 'https://cdn.contentful.com',
    version: '1.0.0',
    hasConfig: true
  };
};
