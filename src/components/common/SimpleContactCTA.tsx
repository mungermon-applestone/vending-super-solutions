
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import TranslatableText from '@/components/translation/TranslatableText';

interface SimpleContactCTAProps {
  title?: string;
  description?: string;
  className?: string;
  /** Optional form type for tracking and email templates */
  formType?: string;
  /** Custom button text for the primary CTA */
  primaryButtonText?: string;
  /** Custom button URL for the secondary button */
  secondaryButtonUrl?: string;
  /** Custom button text for the secondary CTA */
  secondaryButtonText?: string;
  /** Optional callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Form variant style - added for compatibility with new forms */
  formVariant?: string;
  /** Initial values for form fields - added for compatibility with new forms */
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
 * SimpleContactCTA Component
 * 
 * A simple call-to-action section with buttons that direct users to contact pages
 */
const SimpleContactCTA: React.FC<SimpleContactCTAProps> = ({ 
  title = "Ready to Transform Your Vending Operations?", 
  description = "Get in touch and we'll start you on your vending journey.",
  className = "",
  formType = "CTA Form",
  primaryButtonText = "Request a Demo",
  secondaryButtonUrl = "/products",
  secondaryButtonText = "Learn More",
  onCtaClick,
  // We're not using these props directly in this component but they're included for compatibility
  formVariant,
  initialValues
}) => {
  // Handle CTA click with tracking
  const handlePrimaryClick = () => {
    trackEvent('cta_clicked', {
      cta_text: primaryButtonText,
      cta_location: window.location.pathname,
      cta_type: 'primary'
    });
    
    // Navigate to contact page or use custom callback
    if (onCtaClick) {
      onCtaClick();
    } else {
      // By default, direct to contact page
      window.location.href = "/contact";
    }
  };

  return (
    <section className={`bg-vending-blue-light py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <TranslatableText context="contact-cta">{title}</TranslatableText>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            <TranslatableText context="contact-cta">{description}</TranslatableText>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg"
              className="flex items-center"
              onClick={handlePrimaryClick}
            >
              <TranslatableText context="contact-cta">{primaryButtonText}</TranslatableText> <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={secondaryButtonUrl}>
                <TranslatableText context="contact-cta">{secondaryButtonText}</TranslatableText>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleContactCTA;
