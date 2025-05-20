
import React from 'react';
import { ContactSection } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({ 
  title = "Interested in achieving this business goal?", 
  description = "Contact us to learn how our vending solutions can help you meet this goal."
}) => {
  return (
    <ContactSection 
      title={title} 
      description={description}
      formType="Business Goal Inquiry"
      className="w-full"
    />
  );
};

export default BusinessGoalInquiry;
