
import { FormSubmissionData } from './emailService';
import { emailConfig } from './emailConfig';

/**
 * NOTE: This service is deprecated.
 * Email sending is now handled directly in the form components using Formspree.
 */

/**
 * Legacy function maintained for compatibility
 */
export async function sendWithSendGrid(data: FormSubmissionData): Promise<{ success: boolean, message: string }> {
  console.log('SendGrid service called with data:', data);
  console.log('NOTE: This service is deprecated. Forms now use direct Formspree submission.');
  
  return {
    success: false,
    message: "The SendGrid service has been migrated to Formspree. Please update your code."
  };
}

/**
 * Legacy function maintained for compatibility
 */
export function getSendGridConfigStatus(): { 
  isConfigured: boolean; 
  provider: string;
  missingEnvVars: string[];
} {
  return {
    isConfigured: false,
    provider: 'Formspree',
    missingEnvVars: ['SENDGRID_IS_DEPRECATED']
  };
}
