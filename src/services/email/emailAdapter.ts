
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
  try {
    // Use direct SendGrid integration
    return await sendWithSendGrid(data);
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      message: error instanceof Error 
        ? `Failed to send email: ${error.message}`
        : "An unexpected error occurred while sending the email. Please try again later."
    };
  }
}
