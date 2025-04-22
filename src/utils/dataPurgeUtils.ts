
/**
 * Data purge utilities
 * These functions are simplified stubs since we're not using Supabase CMS anymore.
 */

export const purgeData = async (entityType: string) => {
  console.log(`Purging ${entityType} data is no longer needed with Contentful CMS`);
  return {
    success: false,
    message: 'Data purging is not supported with Contentful CMS'
  };
};

export const getPurgeOptions = () => {
  return [
    { id: 'machines', label: 'Machines' },
    { id: 'business_goals', label: 'Business Goals' },
    { id: 'technologies', label: 'Technologies' }
  ];
};
