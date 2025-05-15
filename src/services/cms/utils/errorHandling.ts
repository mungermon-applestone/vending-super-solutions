
/**
 * Standard error handler for CMS operations
 * 
 * @param error The original error
 * @param operation The operation being performed (fetch, create, update, delete)
 * @param contentType The type of content being operated on
 * @param identifier Optional identifier for the specific content item
 * @returns A standardized error object
 */
export function handleCMSError(
  error: unknown, 
  operation: 'fetch' | 'create' | 'update' | 'delete' | 'initialize',
  contentType: string,
  identifier?: string
): Error {
  // Get message from the error
  const originalMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Create a standard error message
  let message = `Failed to ${operation} ${contentType}`;
  if (identifier) {
    message += ` (${identifier})`;
  }
  message += `: ${originalMessage}`;
  
  // Log the error for debugging
  console.error(`[CMS Error] ${message}`, error);
  
  // Return a new error with the formatted message
  return new Error(message);
}

/**
 * Helper function to create user-friendly error messages for CMS operations
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  defaultMessage = 'An unexpected error occurred'
): string {
  if (!error) return defaultMessage;
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('401')) {
      return 'Authentication error. Please check your CMS credentials.';
    }
    
    if (error.message.includes('404')) {
      return 'Content not found. It may have been deleted or moved.';
    }
    
    if (error.message.includes('429')) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    
    return error.message;
  }
  
  return defaultMessage;
}
