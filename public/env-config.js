
// This file is created to expose environment variables to the client
window.env = {
  // These are the Contentful credentials that should be picked up by the application
  CONTENTFUL_SPACE_ID: "p8y13tvmv0uj", 
  CONTENTFUL_DELIVERY_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
  CONTENTFUL_ENVIRONMENT: "master",
  
  // Also add the NEXT_PUBLIC versions for compatibility
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID: "p8y13tvmv0uj",
  NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
  NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT: "master"
};

// Enhanced debug logging
console.log("Contentful Environment configuration loaded from env-config.js:", { 
  hasConfig: !!window.env,
  spaceId: window.env?.CONTENTFUL_SPACE_ID 
    ? `${window.env.CONTENTFUL_SPACE_ID.substring(0, 3)}...${window.env.CONTENTFUL_SPACE_ID.substring(window.env.CONTENTFUL_SPACE_ID.length-3)}` 
    : 'Not set',
  tokenAvailable: !!window.env?.CONTENTFUL_DELIVERY_TOKEN,
  environment: window.env?.CONTENTFUL_ENVIRONMENT || 'master'
});

