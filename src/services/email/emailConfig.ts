
/**
 * Email Configuration
 * 
 * This file contains configuration settings for email services.
 * It will be expanded in the future to support direct SendGrid integration.
 */

/**
 * Email service configuration
 */
export const emailConfig = {
  /**
   * The email service provider to use
   * Currently we're using a transitional approach with the adapter
   * In the future, we'll update this to use SENDGRID directly
   */
  provider: 'ADAPTER', // 'ADAPTER' | 'SENDGRID'
  
  /**
   * Default recipient email address
   * This is used as a fallback if not provided in the environment variables
   */
  defaultRecipient: 'munger@applestonesolutions.com',
  
  /**
   * Default sender email address
   * This is used as a fallback if not provided in the environment variables
   */
  defaultSender: 'noreply@applestonesolutions.com',
  
  /**
   * Development mode configuration
   * In development mode, emails are logged to the console instead of being sent
   */
  developmentMode: {
    /**
     * Whether to log emails to the console in development mode
     */
    logEmails: true,
  },
};
