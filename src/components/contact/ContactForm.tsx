
import React from 'react';
import StandardContactForm from './StandardContactForm';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  return (
    <div className="flex-1">
      <StandardContactForm 
        formTitle={formSectionTitle || 'Send Us a Message'} 
        formType="contact"
        showSubject={true}
      />
    </div>
  );
};

export default ContactForm;
