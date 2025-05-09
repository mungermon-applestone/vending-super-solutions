
import { FormSubmissionData } from './emailService';

/**
 * This is a simplified version of the email adapter that just logs data.
 * Actual email sending is now handled directly in the form components using Formspree.
 * 
 * @param data Form submission data
 * @returns Promise with the API response
 */
export async function sendEmail(data: FormSubmissionData): Promise<{ success: boolean; message: string }> {
  console.log('Email adapter called with data:', data);
  console.log('NOTE: This adapter is deprecated. Forms now use direct Formspree submission.');
  
  try {
    // Just return success since this is just a stub
    return {
      success: true,
      message: "Form submission logged. Please note that the email service has been migrated to Formspree."
    };
  } catch (error) {
    console.error("Email adapter called:", error);
    return {
      success: false,
      message: "This email service has been deprecated. Forms now use Formspree."
    };
  }
}
