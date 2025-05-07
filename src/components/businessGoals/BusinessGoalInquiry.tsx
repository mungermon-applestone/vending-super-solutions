
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({ title, description }) => {
  // Use the standard SimpleContactCTA without passing custom title
  return <SimpleContactCTA description={description} />;
};

export default BusinessGoalInquiry;
