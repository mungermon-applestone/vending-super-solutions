
import React from 'react';
import { ContactSection } from '@/components/common';

const BusinessGoalsContactSection: React.FC = () => {
  // Replace SimpleContactCTA with ContactSection
  return (
    <ContactSection
      title="Ready to achieve your business goals?" 
      description="Get in touch to learn how our solutions can help you meet your business objectives."
      formType="Business Goals Page Inquiry"
      className="w-full"
    />
  );
};

export default BusinessGoalsContactSection;
