
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
}

const ContactFormToggle: React.FC<ContactFormToggleProps> = ({
  showFormByDefault = false,
  title,
  description,
  formVariant = 'compact',
  className = '',
  formType = 'CTA Toggle Form'
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
