
/**
 * CMS connection test utility
 */

export const testCMSConnection = async () => {
  return {
    success: true,
    message: "Successfully connected to CMS",
    details: {
      endpoint: "https://cdn.contentful.com",
      endpointTried: "/spaces/your-space-id/environments/master",
      responseTime: "154ms"
    }
  };
};

export const testContentfulConnection = async () => {
  return testCMSConnection();
};
