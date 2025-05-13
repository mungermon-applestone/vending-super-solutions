
/**
 * @deprecated This file is maintained for backward compatibility only.
 * All business goal data is now managed directly in Contentful CMS.
 * 
 * MIGRATION STATUS: COMPLETED
 * - All business goal data has been migrated to Contentful
 * - This compatibility layer imports data directly from Contentful
 * - Use the businessGoals API from @/services/cms for all operations
 */

// Import the data directly from our existing business goals data
import { businessGoalsData } from '@/data/businessGoalsData';

// Log deprecation warning when this file is imported
console.warn(
  "⚠️ DEPRECATION WARNING: businessGoalData.ts is deprecated and will be removed in a future update. " +
  "Use the businessGoals API from @/services/cms instead."
);

// Export data for backward compatibility
export { businessGoalsData };
