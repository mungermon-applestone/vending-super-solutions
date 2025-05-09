
/**
 * SendGrid Email Service
 * 
 * This service will provide direct integration with SendGrid to send emails
 * from client-side code. This will be used in a future phase once we fully
 * migrate away from the Vercel API implementation.
 */

import { FormSubmissionData } from './emailService';

/**
 * Sends an email using SendGrid's direct API
 * Note: This is a placeholder for future implementation
 * 
 * @param data Form submission data
 * @returns Promise with success or error information
 */
export async function sendWithSendGrid(data: FormSubmissionData): Promise<{ success: boolean, message: string }> {
  // In a future phase, this will directly integrate with SendGrid's client-side API
  // or use a generic email service provider like EmailJS
  
  // For now, we're still using the Vercel API adapter,
  // but this is where we would implement direct SendGrid integration
  
  // Return a placeholder response
  return {
    success: false,
    message: 'Direct SendGrid integration not yet implemented'
  };
}

/**
 * This function provides information about the SendGrid configuration status
 * This is useful for debugging and admin panels
 * 
 * @returns Configuration status
 */
export function getSendGridConfigStatus(): { 
  isConfigured: boolean; 
  provider: string;
  missingEnvVars: string[];
} {
  // Check if we have the necessary environment variables for SendGrid
  const hasSendGridKey = Boolean(process.env.SENDGRID_API_KEY);
  const hasEmailTo = Boolean(process.env.EMAIL_TO);
  const hasEmailFrom = Boolean(process.env.EMAIL_FROM);
  
  const missingEnvVars = [];
  if (!hasSendGridKey) missingEnvVars.push('SENDGRID_API_KEY');
  if (!hasEmailTo) missingEnvVars.push('EMAIL_TO');
  if (!hasEmailFrom) missingEnvVars.push('EMAIL_FROM');
  
  return {
    isConfigured: hasSendGridKey && hasEmailTo && hasEmailFrom,
    provider: 'SendGrid',
    missingEnvVars
  };
}
