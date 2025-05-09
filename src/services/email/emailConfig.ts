
/**
 * Email Configuration
 * 
 * Basic configuration for email functionality.
 */

/**
 * Email configuration
 */
export const emailConfig = {
  /**
   * Default recipient email address
   */
  defaultRecipient: 'munger@applestonesolutions.com',
  
  /**
   * Default sender email address (for display purposes)
   */
  defaultSender: 'noreply@applestonesolutions.com'
};

/**
 * Get the email environment configuration
 * Simplified version that provides basic information for UI display
 */
export function getEmailEnvironment() {
  return {
    recipientEmail: emailConfig.defaultRecipient,
    senderEmail: emailConfig.defaultSender,
    isDevelopment: process.env.NODE_ENV === 'development'
  };
}
