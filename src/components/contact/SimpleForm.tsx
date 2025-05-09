
import React from 'react';
import ContactFormNew from './ContactFormNew';

interface SimpleFormProps {
  formTitle?: string;
  onSuccess?: () => void;
  formType?: string;
  redirectUrl?: string;
  className?: string;
}

/**
 * SimpleForm Component
 * 
 * This is a wrapper around ContactFormNew for backward compatibility.
 * It preserves the original SimpleForm API while using the new implementation.
 */
const SimpleForm: React.FC<SimpleFormProps> = (props) => {
  return <ContactFormNew {...props} variant="compact" />;
};

export default SimpleForm;
