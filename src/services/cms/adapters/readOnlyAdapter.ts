
/**
 * Re-export createReadOnlyAdapter from the deprecation utilities
 * This maintains backward compatibility for imports
 */

import { createReadOnlyAdapter, createReadOnlyContentTypeOperations } from '../utils/deprecation';

export { createReadOnlyAdapter, createReadOnlyContentTypeOperations };

/**
 * @deprecated Legacy function - use createReadOnlyAdapter directly from deprecation.ts
 * Creates a read-only adapter that prevents write operations
 */
export const makeAdapterReadOnly = createReadOnlyAdapter;
