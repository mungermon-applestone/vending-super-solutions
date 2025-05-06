
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({ title, description }) => {
  return <SimpleContactCTA title={title} description={description} />;
};

export default BusinessGoalInquiry;
