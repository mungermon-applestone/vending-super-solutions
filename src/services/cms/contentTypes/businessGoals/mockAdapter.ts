
/**
 * @deprecated READ-ONLY COMPATIBILITY LAYER - Do not use in new development
 * This file has been updated to prevent direct database operations
 * as part of the migration to Contentful for content management.
 */

import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when any function is called
const warnDeprecated = (functionName: string) => {
  logDeprecationWarning(
    functionName,
    "Direct database operations are disabled as we migrate to Contentful.",
    "Please use Contentful directly for content management."
  );
};

/**
 * Mock implementation of business goal create operation - now throws an error
 * @param data Optional data parameter (ignored)
 */
export async function mockCreateBusinessGoal(data?: any): Promise<string> {
  warnDeprecated('mockCreateBusinessGoal');
  throw new Error("Business Goal creation is disabled. Please use Contentful directly.");
}

/**
 * Mock implementation of business goal update operation - now throws an error
 * @param id Optional id parameter (ignored)
 * @param data Optional data parameter (ignored)
 */
export async function mockUpdateBusinessGoal(id?: string, data?: any): Promise<boolean> {
  warnDeprecated('mockUpdateBusinessGoal');
  throw new Error("Business Goal updates are disabled. Please use Contentful directly.");
}

/**
 * Mock implementation of business goal delete operation - now throws an error
 * @param id Optional id parameter (ignored)
 */
export async function mockDeleteBusinessGoal(id?: string): Promise<boolean> {
  warnDeprecated('mockDeleteBusinessGoal');
  throw new Error("Business Goal deletion is disabled. Please use Contentful directly.");
}

/**
 * Mock implementation of business goal clone operation - now throws an error
 * @param id Optional id parameter (ignored)
 */
export async function mockCloneBusinessGoal(id?: string): Promise<string | null> {
  warnDeprecated('mockCloneBusinessGoal');
  throw new Error("Business Goal cloning is disabled. Please use Contentful directly.");
}
