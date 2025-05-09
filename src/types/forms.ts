
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

/**
 * Product form data interface
 */
export interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: {
    title: string;
    description: string;
    icon: string;
    screenshotUrl: string;
    screenshotAlt: string;
  }[];
}

/**
 * Business goal form data interface
 */
export interface BusinessGoalFormData {
  title: string;
  slug: string;
  description: string;
  icon?: string;
  image: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: {
    title: string;
    description: string;
    icon: string;
    screenshotUrl: string;
    screenshotAlt: string;
  }[];
}
