
/**
 * Landing page operations
 * This provides simple stub functions for landing page operations.
 */

// Re-export functions
export const fetchLandingPages = async () => [];
export const fetchLandingPageByKey = async () => null;
export const createLandingPage = async () => null;
export const updateLandingPage = async () => false;
export const deleteLandingPage = async () => false;

// Export operations object
export const landingPageOperations = {
  getAll: fetchLandingPages,
  getByKey: fetchLandingPageByKey,
  create: createLandingPage,
  update: updateLandingPage,
  delete: deleteLandingPage
};
