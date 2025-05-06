
// This file is created to expose environment variables to the client
window.env = {
  // These are sample Contentful credentials for demo purposes
  // Replace with your actual credentials for production use
  CONTENTFUL_SPACE_ID: "p8y13tvmv0uj", 
  CONTENTFUL_DELIVERY_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
  CONTENTFUL_ENVIRONMENT: "master"
};

// Log for debugging
console.log("Environment configuration loaded", { 
  hasConfig: !!window.env,
  spaceIdAvailable: !!window.env?.CONTENTFUL_SPACE_ID,
  tokenAvailable: !!window.env?.CONTENTFUL_DELIVERY_TOKEN
});
