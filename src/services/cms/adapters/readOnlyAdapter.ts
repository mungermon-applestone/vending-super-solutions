
/**
 * Re-export createReadOnlyAdapter from the deprecation utilities
 * This maintains backward compatibility for imports
 */

import { createReadOnlyAdapter } from '../utils/deprecation';

export { createReadOnlyAdapter };

/**
 * @deprecated Legacy function - use createReadOnlyAdapter directly from deprecation.ts
 * Creates a read-only adapter that prevents write operations
 */
export const makeAdapterReadOnly = createReadOnlyAdapter;
