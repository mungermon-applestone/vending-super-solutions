
// Type definitions for form submission data
export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  formType: string;
  location?: string;
}

/**
 * NOTE: This service is deprecated. 
 * Form submissions are now handled directly in the form components using Formspree.
 * This file is kept for type compatibility only.
 */
export async function sendContactEmail(data: FormSubmissionData): Promise<{ success: boolean, message: string }> {
  console.log('Legacy email service called. This is deprecated.');
  
  return {
    success: false,
    message: "The email service has been migrated to direct form submission. Please update your code."
  };
}
