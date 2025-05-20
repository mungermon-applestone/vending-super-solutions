
import React from 'react';
import { ContactSection } from '@/components/common';

const BusinessGoalsContactSection: React.FC = () => {
  // Use our new ContactSection component with business-specific messaging
  return (
    <ContactSection
      title="Ready to achieve your business goals with vending technology?"
      description="Contact our team to discuss how our innovative vending solutions can help you meet your specific business objectives."
      formType="Business Goals Page Inquiry"
      formVariant="compact"
    />
  );
};

export default BusinessGoalsContactSection;
