
import React from 'react';
import { StandardForm } from '@/components/common';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  return (
    <div className="flex-1">
      <StandardForm 
        title={formSectionTitle || 'Send Us a Message'} 
        formType="Contact Form"
      />
    </div>
  );
};

export default ContactForm;
