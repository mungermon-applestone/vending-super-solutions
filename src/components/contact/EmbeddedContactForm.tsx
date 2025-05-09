
import React from 'react';
import ContactFormNew from './ContactFormNew';
import { trackFormView } from '@/utils/analytics';

/**
 * EmbeddedContactForm Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component provides a configurable contact form that can be embedded anywhere in the site
 * - The form maintains consistent styling with other form components but can be sized differently
 * - Form submissions are tracked in analytics for conversion monitoring
 * - Success/error states are handled with consistent UI patterns
 * 
 * This is a wrapper around ContactFormNew for backward compatibility.
 * 
 * @param {EmbeddedContactFormProps} props - Component properties
 * @returns React component
 */
export interface EmbeddedContactFormProps {
  /** The form's visual variant */
  variant?: 'compact' | 'full' | 'inline';
  /** Form section heading */
  title?: string;
  /** Additional context for the form section */
  description?: string;
  /** Type of the form for tracking and email templates */
  formType?: string;
  /** CSS class names for custom styling */
  className?: string;
  /** URL to redirect after successful submission */
  redirectUrl?: string;
  /** Callback function when form is submitted successfully */
  onSuccess?: () => void;
  /** Initial values for form fields */
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
  };
}

const EmbeddedContactForm: React.FC<EmbeddedContactFormProps> = (props) => {
  const { variant = 'compact', ...restProps } = props;
  
  // Track form view when the component mounts
  React.useEffect(() => {
    trackFormView(props.formType || 'Embedded Contact Form', window.location.pathname);
  }, [props.formType]);

  return (
    <ContactFormNew 
      {...restProps}
      variant={variant === 'inline' ? 'compact' : variant}
      formTitle={props.title}
    />
  );
};

export default EmbeddedContactForm;
