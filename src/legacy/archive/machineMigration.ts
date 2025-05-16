
/**
 * @deprecated ARCHIVED CODE - Do not use in new development
 * 
 * This file has been moved to the archive as part of our migration from
 * legacy CMS implementations to Contentful.
 * 
 * Use Contentful CMS integration for machine content management.
 */

import { migrateMachinesData } from '@/legacy/cms/machineMigration';
import type { 
  MachinePlaceholder, 
  MigrationResult, 
  MachineFormValues,
  MachineData 
} from '@/legacy/cms/machineMigration/types';

export { migrateMachinesData };
export type { MachinePlaceholder, MigrationResult, MachineFormValues, MachineData };
