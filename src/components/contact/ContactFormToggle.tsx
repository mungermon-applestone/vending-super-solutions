
import React, { useState } from 'react';
import EmbeddedContactForm from './EmbeddedContactForm';
import { SimpleContactCTA } from '@/components/common';
import { trackEvent } from '@/utils/analytics';

/**
 * ContactFormToggle Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component provides a mechanism to toggle between a CTA and a contact form
 * - It maintains the same spacing and visual rhythm as SimpleContactCTA 
 * - The transition between CTA and form is smooth and doesn't cause layout shifts
 * - Analytics events track when users toggle between views
 * 
 * @param {ContactFormToggleProps} props - Component properties
 * @returns React component
 */
interface ContactFormToggleProps {
  /** Show the form by default instead of CTA */
  showFormByDefault?: boolean;
  /** Title for both CTA and form */
  title?: string;
  /** Description for both CTA and form */
  description?: string;
  /** Contact form variant */
  formVariant?: 'compact' | 'full' | 'inline';
  /** Additional CSS classes */
  className?: string;
  /** Form type for analytics and email templates */
  formType?: string;
  /** Initial values for the form fields */
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
  };
  /** URL to redirect after successful form submission */
  redirectUrl?: string;
  /** Callback function when form is submitted successfully */
  onSuccess?: () => void;
}

const ContactFormToggle: React.FC<ContactFormToggleProps> = ({
  showFormByDefault = false,
  title,
  description,
  formVariant = 'compact',
  className = '',
  formType = 'CTA Toggle Form',
  initialValues,
  redirectUrl,
  onSuccess
}) => {
  const [showForm, setShowForm] = useState(showFormByDefault);
  
  const handleShowForm = () => {
    setShowForm(true);
    trackEvent('cta_form_toggled', {
      action: 'show_form',
      form_type: formType,
      location: window.location.pathname
    });
  };
  
  const handleFormSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    
    // Reset to CTA view after 5 seconds if redirect isn't specified
    if (!redirectUrl) {
      setTimeout(() => {
        setShowForm(false);
      }, 5000);
    }
  };
  
  return (
    <div className={`transition-all duration-300 ${className}`}>
      {showForm ? (
        <div className="bg-vending-blue-light py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <EmbeddedContactForm
                variant={formVariant}
                title={title}
                description={description}
                formType={formType}
                initialValues={initialValues}
                redirectUrl={redirectUrl}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </div>
      ) : (
        <SimpleContactCTA 
          title={title}
          description={description}
          onCtaClick={handleShowForm}
        />
      )}
    </div>
  );
};

export default ContactFormToggle;
