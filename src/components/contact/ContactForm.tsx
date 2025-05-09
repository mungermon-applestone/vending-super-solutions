
import React from 'react';
import ContactFormNew from './ContactFormNew';
import { trackFormView } from '@/utils/analytics';

interface ContactFormProps {
  formSectionTitle?: string;
}

/**
 * ContactForm Component
 * 
 * This is a wrapper around ContactFormNew for backward compatibility.
 * It preserves the original ContactForm API while using the new implementation.
 */
const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  // Track form view when component mounts
  React.useEffect(() => {
    trackFormView('Contact Form', window.location.pathname);
  }, []);

  return (
    <div className="flex-1">
      <ContactFormNew
        formTitle={formSectionTitle || 'Send Us a Message'}
        formType='Contact Page Form'
        variant="full"
      />
    </div>
  );
};

export default ContactForm;
