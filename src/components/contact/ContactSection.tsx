
import React from 'react';
import EmbeddedContactForm from './EmbeddedContactForm';
import { trackEvent } from '@/utils/analytics';

interface ContactSectionProps {
  title?: string;
  description?: string;
  className?: string;
  /** Optional form type for tracking and email templates */
  formType?: string;
  /** Custom button text for the primary CTA - kept for API compatibility */
  primaryButtonText?: string;
  /** Custom button URL for the secondary button - kept for API compatibility */
  secondaryButtonUrl?: string;
  /** Custom button text for the secondary CTA - kept for API compatibility */
  secondaryButtonText?: string;
  /** Optional callback when form is submitted - kept for API compatibility */
  onCtaClick?: () => void;
  /** Form variant style */
  formVariant?: 'compact' | 'full' | 'inline';
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

/**
 * ContactSection Component
 * 
 * A section with an embedded contact form that replaces the SimpleContactCTA
 * while maintaining API compatibility
 */
const ContactSection: React.FC<ContactSectionProps> = ({ 
  title = "Ready to Transform Your Vending Operations?", 
  description = "Get in touch and we'll start you on your vending journey.",
  className = "",
  formType = "Home Page Form",
  formVariant = "compact",
  initialValues,
  // These props are kept for API compatibility but not used directly
  primaryButtonText,
  secondaryButtonUrl,
  secondaryButtonText,
  onCtaClick
}) => {
  // Track section view for analytics
  React.useEffect(() => {
    trackEvent('contact_section_view', {
      form_type: formType,
      location: window.location.pathname
    });
  }, [formType]);

  return (
    <section className={`bg-blue-50 py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          {/* Left side content */}
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">
              {description}
            </p>
          </div>
          
          {/* Right side form */}
          <div className="md:w-1/2 w-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <EmbeddedContactForm 
                title="Send Us a Message" 
                variant={formVariant}
                formType={formType}
                className="w-full"
                initialValues={initialValues}
                onSuccess={() => {
                  if (onCtaClick) onCtaClick();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
