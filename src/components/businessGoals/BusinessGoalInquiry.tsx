
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = () => {
  return <SimpleContactCTA />;
};

export default BusinessGoalInquiry;
