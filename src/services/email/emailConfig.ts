
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
  provider: 'SENDGRID', 
  
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
   * In development mode, emails are not actually sent but logged to the console
   */
  developmentMode: {
    /**
     * Whether to log emails to the console in development mode
     */
    logEmails: true,
    
    /**
     * Force development mode regardless of NODE_ENV
     * This can be useful for testing in production environments
     */
    forceDevelopmentMode: false
  },
  
  /**
   * SendGrid configuration
   */
  sendGrid: {
    /**
     * Endpoint for the SendGrid API
     */
    endpoint: 'https://api.sendgrid.com/v3/mail/send'
  }
};

/**
 * Get the current environment configuration for email services
 * This checks for environment variables and falls back to defaults
 * 
 * @returns Email environment configuration
 */
export function getEmailEnvironment() {
  // Check if we're in development mode or if it's forced
  const isDevelopment = process.env.NODE_ENV === 'development' || emailConfig.developmentMode.forceDevelopmentMode;
  
  return {
    // API key for SendGrid
    sendGridApiKey: process.env.SENDGRID_API_KEY || '',
    
    // Recipient email address (where to send form submissions)
    recipientEmail: process.env.EMAIL_TO || emailConfig.defaultRecipient,
    
    // Sender email address (from address for emails)
    senderEmail: process.env.EMAIL_FROM || emailConfig.defaultSender,
    
    // Whether we're in development mode
    isDevelopment,
    
    // Whether to log emails instead of sending
    logEmails: isDevelopment && emailConfig.developmentMode.logEmails
  };
}
