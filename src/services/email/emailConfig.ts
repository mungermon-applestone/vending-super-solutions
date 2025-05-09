
/**
 * Email Configuration
 * 
 * This file contains a simplified configuration for email services.
 */

/**
 * Email service configuration
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
 * Simplified version that just provides basic information for UI display
 */
export function getEmailEnvironment() {
  return {
    recipientEmail: emailConfig.defaultRecipient,
    senderEmail: emailConfig.defaultSender,
    isDevelopment: process.env.NODE_ENV === 'development'
  };
}
