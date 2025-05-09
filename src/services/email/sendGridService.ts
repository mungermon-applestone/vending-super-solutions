
/**
 * SendGrid Integration Service
 * 
 * This is a minimal implementation to support the AdminSettings component
 * without requiring actual SendGrid integration.
 */

/**
 * Check if SendGrid is properly configured by verifying required environment variables
 */
export function getSendGridConfigStatus() {
  const requiredEnvVars = ['SENDGRID_API_KEY', 'EMAIL_TO', 'EMAIL_FROM'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  return {
    isConfigured: missingEnvVars.length === 0,
    missingEnvVars
  };
}
