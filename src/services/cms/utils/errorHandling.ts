
/**
 * Standardized error handling for CMS operations
 * @param error The caught error
 * @param operation Description of the operation that failed
 * @param entityType Type of entity being operated on (e.g., 'technology')
 * @param entityId Optional ID of the entity
 * @returns Error with standardized message
 */
export function handleCMSError(
  error: unknown, 
  operation: string,
  entityType: string,
  entityId?: string
): Error {
  console.error(`CMS Error: ${operation} ${entityType}${entityId ? ` (ID: ${entityId})` : ''}:`, error);
  
  // Extract message from error
  let message = 'Unknown error occurred';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as any).message);
  }
  
  // Standardize error message
  return new Error(`Failed to ${operation} ${entityType}${entityId ? ` (ID: ${entityId})` : ''}: ${message}`);
}

/**
 * Check if an error is a not found error
 * @param error The error to check
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('not found') || error.message.includes('404');
  }
  return false;
}

/**
 * Check if an error is an authorization error
 * @param error The error to check
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('unauthorized') || 
           error.message.includes('forbidden') || 
           error.message.includes('401') ||
           error.message.includes('403');
  }
  return false;
}
