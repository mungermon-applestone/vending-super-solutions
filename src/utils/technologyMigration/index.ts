
/**
 * This file is kept as a placeholder for future technology migration utilities.
 * The legacy technology migration code has been removed since all data management
 * is now handled directly through Contentful.
 */

export const checkIfTechnologyDataExists = async (): Promise<boolean> => {
  // Data management handled through Contentful admin
  console.log("Technology data is now managed through Contentful");
  return true;
};

export const migrateTechnologyData = async (): Promise<any[]> => {
  // Migration functionality has been deprecated in favor of Contentful management
  console.log("Technology data migration has been deprecated - use Contentful");
  return [];
};
