
// This file is created to expose environment variables to the client
window.env = {
  // You can manually set these values here for testing
  // Remove or comment them out in production
  CONTENTFUL_SPACE_ID: "YOUR_CONTENTFUL_SPACE_ID", // Replace with your actual Space ID for testing
  CONTENTFUL_DELIVERY_TOKEN: "YOUR_CONTENTFUL_DELIVERY_TOKEN", // Replace with your actual Delivery Token for testing
  CONTENTFUL_ENVIRONMENT: "master"
};

// Log for debugging
console.log("Environment configuration loaded", { 
  hasConfig: !!window.env,
  spaceIdAvailable: !!window.env?.CONTENTFUL_SPACE_ID
});
