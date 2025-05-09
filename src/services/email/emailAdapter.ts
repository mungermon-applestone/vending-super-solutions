
import { sendContactEmail, FormSubmissionData } from './emailService';
import { sendWithSendGrid } from './sendGridService';
import { emailConfig } from './emailConfig';

/**
 * This adapter maintains the same API for components while allowing us
 * to switch between the legacy implementation and the new direct SendGrid
 * implementation based on configuration.
 * 
 * @param data Form submission data
 * @returns Promise with the API response
 */
export async function sendEmail(data: FormSubmissionData): Promise<{ success: boolean; message: string }> {
  // Determine which provider to use based on config
  if (emailConfig.provider === 'SENDGRID') {
    // Use direct SendGrid integration
    return sendWithSendGrid(data);
  } else {
    // Use legacy approach (Vercel API route)
    return sendContactEmail(data);
  }
}

/**
 * Feature flag to control whether to use the new email service
 * This can be used to gradually roll out the new implementation
 * or roll back in case of issues
 */
export const useNewEmailService = true;
