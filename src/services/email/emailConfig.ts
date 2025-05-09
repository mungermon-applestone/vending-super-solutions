
/**
 * Email Configuration
 * 
 * This file contains a simplified configuration for email services.
 * The actual email submission is handled by Formspree in the form components.
 */

/**
 * Email service configuration
 */
export const emailConfig = {
  /**
   * Default recipient email address
   * This is used for display purposes only - actual emails go through Formspree
   */
  defaultRecipient: 'munger@applestonesolutions.com',
  
  /**
   * Default sender email address
   * This is used for display purposes only - actual emails go through Formspree
   */
  defaultSender: 'noreply@applestonesolutions.com',
  
  /**
   * Email service provider
   * Current implementation uses Formspree, previously used SendGrid
   */
  provider: 'Formspree'
};

/**
 * Get the email environment configuration
 * Simplified version that just provides basic information for UI display
 */
export function getEmailEnvironment() {
  // This is a simplified version - actual email handling is in the form components
  return {
    recipientEmail: emailConfig.defaultRecipient,
    senderEmail: emailConfig.defaultSender,
    isDevelopment: process.env.NODE_ENV === 'development',
    logEmails: process.env.NODE_ENV === 'development'
  };
}
