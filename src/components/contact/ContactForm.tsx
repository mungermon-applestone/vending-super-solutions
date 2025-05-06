
import React from 'react';
import { EmailLink } from '@/components/common';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  return (
    <div className="flex-1">
      <EmailLink 
        title={formSectionTitle || 'Send Us a Message'} 
        subject="General Inquiry"
        buttonText="Contact Us"
        description="We'd love to hear from you. Click the button below to send us an email directly."
      />
    </div>
  );
};

export default ContactForm;
