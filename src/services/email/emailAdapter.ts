
import { FormSubmissionData } from './emailService';
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
  // Use direct SendGrid integration
  return sendWithSendGrid(data);
}
