
import React from 'react';
import { ContactSection } from '@/components/common';

const BusinessGoalsContactSection: React.FC = () => {
  // Use our new ContactSection component with standardized messaging
  return (
    <ContactSection
      title="Ready to Get Started?"
      description="Get in touch and we'll start you on your vending journey."
      formType="Business Goals Page Inquiry"
      formVariant="compact"
    />
  );
};

export default BusinessGoalsContactSection;
