
/**
 * Form submission data types
 */

/**
 * Form submission data interface
 * Kept for backward compatibility with existing code
 */
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
