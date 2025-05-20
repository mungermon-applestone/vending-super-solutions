
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({ 
  title = "Interested in achieving this business goal?", 
  description = "Contact us to learn how our vending solutions can help you meet this goal."
}) => {
  return <SimpleContactCTA title={title} description={description} />;
};

export default BusinessGoalInquiry;
