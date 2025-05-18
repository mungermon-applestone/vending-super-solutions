
/**
 * @deprecated This file is being consolidated into a central adapter utilities module
 * and will be removed in a future version.
 */

import { logDeprecation } from './deprecation';
import { ProviderConfig } from '../adapters/types';

/**
 * Validates the provider configuration against adapter requirements
 * 
 * @param config The current provider configuration
 * @param requiredType The required provider type for the adapter
 * @returns true if the configuration is compatible, false otherwise
 * 
 * @deprecated Use direct provider configuration instead
 */
export function validateCompatibility(config: ProviderConfig, requiredType: string): boolean {
  logDeprecation(
    'validateCompatibility',
    'adapter-compatibility',
    'This compatibility check is being phased out as we consolidate CMS providers.'
  );
  
  if (config.type.toString() !== requiredType) {
    console.warn(`Adapter compatibility warning: Expected ${requiredType}, got ${config.type}`);
    return false;
  }
  
  return true;
}
