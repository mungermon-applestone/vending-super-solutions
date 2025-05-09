
/**
 * Email Configuration
 * 
 * This file contains configuration settings for email services.
 */

/**
 * Email service configuration
 */
export const emailConfig = {
  /**
   * The email service provider to use
   * Options: 'SENDGRID' | 'ADAPTER'
   * - ADAPTER: Uses the legacy API endpoint (transitional)
   * - SENDGRID: Uses direct SendGrid integration
   */
  provider: 'SENDGRID', // Changed from 'ADAPTER' to 'SENDGRID'
  
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
