
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import { trackEvent } from '@/utils/analytics';
import ContactFormToggle from '@/components/contact/ContactFormToggle';

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
}

/**
 * SimpleContactCTA Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component provides a consistent call-to-action section across pages
 * - Background color is always bg-vending-blue-light for visual consistency
 * - Text alignment is centered with controlled width for readability
 * - Button styling and order is critical for conversion rate optimization
 * - Maintains consistent padding (py-16) across all pages
 * 
 * @param {SimpleContactCTAProps} props - Component properties
 * @returns React component
 */
const SimpleContactCTA: React.FC<SimpleContactCTAProps> = ({ 
  title, 
  description,
  className = "",
  formType = "CTA Form",
  primaryButtonText,
  secondaryButtonUrl,
  secondaryButtonText
}) => {
  const { data: homeContent } = useHomePageContent();
  const [showContactForm, setShowContactForm] = React.useState(false);
  
  // Use provided props or fallback to CMS content
  const displayTitle = title || homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?";
  const displayDescription = description || homeContent?.ctaSectionDescription || 
    "Get in touch and we'll start you on your vending journey.";
  const displayPrimaryButtonText = primaryButtonText || homeContent?.ctaPrimaryButtonText || "Request a Demo";
  const displaySecondaryButtonText = secondaryButtonText || homeContent?.ctaSecondaryButtonText || "Learn More";
  const displaySecondaryButtonUrl = secondaryButtonUrl || homeContent?.ctaSecondaryButtonUrl || "/products";

  // Handle CTA click with tracking
  const handlePrimaryClick = () => {
    trackEvent('cta_clicked', {
      cta_text: displayPrimaryButtonText,
      cta_location: window.location.pathname,
      cta_type: 'primary'
    });
    
    setShowContactForm(true);
  };

  if (showContactForm) {
    return (
      <ContactFormToggle
        showFormByDefault={true}
        title={displayTitle}
        description={displayDescription}
        formVariant="compact"
        className={`bg-vending-blue-light py-16 ${className}`}
        formType={formType}
      />
    );
  }

  return (
    <section className={`bg-vending-blue-light py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayTitle}</h2>
          <p className="text-lg text-gray-600 mb-8">{displayDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg"
              className="flex items-center"
              onClick={handlePrimaryClick}
            >
              {displayPrimaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={displaySecondaryButtonUrl}>
                {displaySecondaryButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleContactCTA;
