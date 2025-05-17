
/**
 * @deprecated This operation is deprecated as we have migrated to Contentful CMS
 * 
 * Use Contentful's web interface to manage business goals:
 * https://app.contentful.com
 */
export const deleteBusinessGoal = async (slug: string): Promise<boolean> => {
  console.warn(`[deleteBusinessGoal] DEPRECATED: Business goal deletion via API is no longer supported.
    Please use the Contentful web interface to manage business goals.
    Attempted to delete business goal with slug: ${slug}`);
  
  throw new Error(`Business goal deletion via API is deprecated. 
    Please use the Contentful web interface to manage content.`);
};
