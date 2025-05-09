
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
    // Use legacy approach (API route)
    return sendContactEmail(data);
  }
}

/**
 * Feature flag to control whether to use the new email service
 * This is kept for backward compatibility but will be removed in future versions
 * @deprecated Use emailConfig.provider instead
 */
export const useNewEmailService = emailConfig.provider === 'SENDGRID';
