
import { sendContactEmail, FormSubmissionData } from './emailService';

/**
 * This adapter maintains the same API as the original Vercel API route
 * but uses our new email service internally. This allows us to gradually
 * migrate from the Vercel implementation to our new solution.
 * 
 * @param data Form submission data
 * @returns Promise with the API response
 */
export async function sendEmail(data: FormSubmissionData): Promise<{ success: boolean; message: string }> {
  // We use our new email service
  return sendContactEmail(data);
}

/**
 * Feature flag to control whether to use the new email service
 * This can be used to gradually roll out the new implementation
 * or roll back in case of issues
 */
export const useNewEmailService = true;
